import { getUniqueColor } from '@summerfi/app-earn-ui'
import { type ChartsDataTimeframes, type MultipleSourceChartData } from '@summerfi/app-types'
import { supportedSDKNetwork } from '@summerfi/app-utils'
import dayjs from 'dayjs'

import { type InstiVaultPerformanceResponse } from '@/app/server-handlers/institution/institution-vaults/types'
import { CHART_TIMESTAMP_FORMAT_DETAILED } from '@/features/charts/helpers'
import { getInstiVaultNiceName } from '@/helpers/get-insti-vault-nice-name'

type ChartRow = {
  timestamp: number
  timestampParsed: string
  [key: string]: number | string
}

export const mapMultiVaultChartData = ({
  performanceDataArray,
  institutionName,
}: {
  institutionName?: string
  performanceDataArray: {
    performanceData: InstiVaultPerformanceResponse
    pointName: keyof InstiVaultPerformanceResponse['vault']['hourlyVaultHistory'][number]
    currentPointValue: string
    // Vault's configured display name (fleetMap `name`), preferred over the derived label.
    customName?: string | null
  }[]
}): MultipleSourceChartData => {
  // Single source of the per-vault series label so every place that keys a row / map by it stays
  // consistent (and all honour the configured custom name).
  const getVaultLabel = (
    performanceData: InstiVaultPerformanceResponse,
    customName?: string | null,
  ) =>
    getInstiVaultNiceName({
      network: supportedSDKNetwork(performanceData.vault.protocol.network),
      symbol: performanceData.vault.inputToken.symbol,
      institutionName,
      customName,
    })

  const now = dayjs()
  const nowStartOfHour = now.startOf('hour')
  const nowStartOfDay = now.startOf('day')
  const nowStartOfWeek = now.startOf('week')

  const pointsNeededFor7dChart = now.diff(nowStartOfHour.subtract(7, 'day'), 'hours')
  const pointsNeededFor30dChart = now.diff(nowStartOfHour.subtract(30, 'day'), 'hours')
  const pointsNeededFor90dChart = now.diff(nowStartOfDay.subtract(90, 'day'), 'days')
  const pointsNeededFor6mChart = now.diff(nowStartOfDay.subtract(6, 'month'), 'days')
  const pointsNeededFor1yChart = now.diff(nowStartOfDay.subtract(1, 'year'), 'days')
  const pointsNeededFor3yChart = now.diff(nowStartOfWeek.subtract(3, 'year'), 'weeks')

  const colors: string[] = []
  const dataNames: string[] = []

  const chartBaseData: ChartsDataTimeframes = {
    '7d': [], // hourly
    '30d': [], // hourly
    '90d': [], // daily
    '6m': [], // daily
    '1y': [], // daily
    '3y': [], // weekly
  }

  // Build per-vault lookup maps for fast access
  const perVaultHourly = new Map<
    string,
    Map<number, NonNullable<InstiVaultPerformanceResponse['vault']>['hourlyVaultHistory'][number]>
  >()
  const perVaultDaily = new Map<
    string,
    Map<number, NonNullable<InstiVaultPerformanceResponse['vault']>['dailyVaultHistory'][number]>
  >()
  const perVaultWeekly = new Map<
    string,
    Map<number, NonNullable<InstiVaultPerformanceResponse['vault']>['weeklyVaultHistory'][number]>
  >()

  performanceDataArray.forEach(({ performanceData, customName }) => {
    const vaultLabel = getVaultLabel(performanceData, customName)

    colors.push(getUniqueColor(vaultLabel))
    dataNames.push(vaultLabel)

    const hourlyMap = new Map<
      number,
      NonNullable<InstiVaultPerformanceResponse['vault']>['hourlyVaultHistory'][number]
    >()
    const dailyMap = new Map<
      number,
      NonNullable<InstiVaultPerformanceResponse['vault']>['dailyVaultHistory'][number]
    >()
    const weeklyMap = new Map<
      number,
      NonNullable<InstiVaultPerformanceResponse['vault']>['weeklyVaultHistory'][number]
    >()

    performanceData.vault.hourlyVaultHistory.forEach((point) => {
      hourlyMap.set(
        dayjs(Number(point.timestamp) * 1000)
          .startOf('hour')
          .unix(),
        point,
      )
    })

    performanceData.vault.dailyVaultHistory.forEach((point) => {
      dailyMap.set(
        dayjs(Number(point.timestamp) * 1000)
          .startOf('day')
          .unix(),
        point,
      )
    })

    performanceData.vault.weeklyVaultHistory.forEach((point) => {
      weeklyMap.set(
        dayjs(Number(point.timestamp) * 1000)
          .startOf('week')
          .unix(),
        point,
      )
    })

    perVaultHourly.set(vaultLabel, hourlyMap)
    perVaultDaily.set(vaultLabel, dailyMap)
    perVaultWeekly.set(vaultLabel, weeklyMap)
  })

  // Resolve a single vault's value for a bucket, carrying the last known value forward instead of
  // dropping to 0. The x-axis is anchored to `now`, so the buckets between a vault's latest snapshot
  // and `now` — and the live point itself when a stale/soft-load fetch returns 0/empty — would
  // otherwise backfill as 0 and render as a cliff at the right edge (the "hole"). A real snapshot is
  // always trusted (even 0) and re-anchors the carry-forward, so a vault that genuinely empties still
  // shows its drop; only missing points, and a zero live value when history exists, are carried
  // forward. `lastKnownByVault` is per-timeframe (a fresh map is passed for each series build below).
  const resolveValueWithCarryForward = ({
    rawValue,
    isCurrent,
    currentPointValue,
    vaultLabel,
    lastKnownByVault,
  }: {
    rawValue: number | undefined
    isCurrent: boolean
    currentPointValue: string
    vaultLabel: string
    lastKnownByVault: Map<string, number>
  }): number => {
    if (rawValue !== undefined) {
      lastKnownByVault.set(vaultLabel, rawValue)

      return rawValue
    }

    if (isCurrent) {
      const liveValue = Number(currentPointValue)

      if (Number.isFinite(liveValue) && liveValue > 0) {
        lastKnownByVault.set(vaultLabel, liveValue)

        return liveValue
      }
    }

    return lastKnownByVault.get(vaultLabel) ?? 0
  }

  // Helper to aggregate a single row across all vaults
  const addRowForHour = (
    timestampUnix: number,
    isCurrent: boolean,
    lastKnownByVault: Map<string, number>,
  ) => {
    const row: ChartRow = {
      timestamp: timestampUnix,
      timestampParsed: dayjs.unix(timestampUnix).format(CHART_TIMESTAMP_FORMAT_DETAILED),
    }

    performanceDataArray.forEach(
      ({ performanceData, pointName, currentPointValue, customName }) => {
        const vaultLabel = getVaultLabel(performanceData, customName)
        const existingPoint = perVaultHourly.get(vaultLabel)?.get(timestampUnix)

        row[vaultLabel] = resolveValueWithCarryForward({
          rawValue: existingPoint ? Number(existingPoint[pointName]) : undefined,
          isCurrent,
          currentPointValue,
          vaultLabel,
          lastKnownByVault,
        })
      },
    )

    chartBaseData['7d'].push(row)
  }

  const addRowForHour30d = (
    timestampUnix: number,
    isCurrent: boolean,
    lastKnownByVault: Map<string, number>,
  ) => {
    const row: ChartRow = {
      timestamp: timestampUnix,
      timestampParsed: dayjs.unix(timestampUnix).format(CHART_TIMESTAMP_FORMAT_DETAILED),
    }

    performanceDataArray.forEach(
      ({ performanceData, pointName, currentPointValue, customName }) => {
        const vaultLabel = getVaultLabel(performanceData, customName)
        const existingPoint = perVaultHourly.get(vaultLabel)?.get(timestampUnix)

        row[vaultLabel] = resolveValueWithCarryForward({
          rawValue: existingPoint ? Number(existingPoint[pointName]) : undefined,
          isCurrent,
          currentPointValue,
          vaultLabel,
          lastKnownByVault,
        })
      },
    )

    chartBaseData['30d'].push(row)
  }

  const addRowForDay = (
    timeframe: '90d' | '6m' | '1y',
    timestampUnix: number,
    isCurrent: boolean,
    lastKnownByVault: Map<string, number>,
  ) => {
    const row: ChartRow = {
      timestamp: timestampUnix,
      timestampParsed: dayjs.unix(timestampUnix).format(CHART_TIMESTAMP_FORMAT_DETAILED),
    }

    performanceDataArray.forEach(
      ({ performanceData, pointName, currentPointValue, customName }) => {
        const vaultLabel = getVaultLabel(performanceData, customName)
        const existingPoint = perVaultDaily.get(vaultLabel)?.get(timestampUnix)

        row[vaultLabel] = resolveValueWithCarryForward({
          rawValue: existingPoint ? Number(existingPoint[pointName]) : undefined,
          isCurrent,
          currentPointValue,
          vaultLabel,
          lastKnownByVault,
        })
      },
    )

    chartBaseData[timeframe].push(row)
  }

  const addRowForWeek = (
    timestampUnix: number,
    isCurrent: boolean,
    lastKnownByVault: Map<string, number>,
  ) => {
    const row: ChartRow = {
      timestamp: timestampUnix,
      timestampParsed: dayjs.unix(timestampUnix).format(CHART_TIMESTAMP_FORMAT_DETAILED),
    }

    performanceDataArray.forEach(
      ({ performanceData, pointName, currentPointValue, customName }) => {
        const vaultLabel = getVaultLabel(performanceData, customName)
        const existingPoint = perVaultWeekly.get(vaultLabel)?.get(timestampUnix)

        row[vaultLabel] = resolveValueWithCarryForward({
          rawValue: existingPoint ? Number(existingPoint[pointName]) : undefined,
          isCurrent,
          currentPointValue,
          vaultLabel,
          lastKnownByVault,
        })
      },
    )

    chartBaseData['3y'].push(row)
  }

  // Generate complete 7d chart (hourly points)
  const lastKnown7d = new Map<string, number>()

  for (let i = pointsNeededFor7dChart - 1; i >= 0; i--) {
    const pointTime = nowStartOfHour.subtract(i, 'hours')
    const timestampUnix = pointTime.unix()
    const isSameHour = pointTime.isSame(nowStartOfHour)

    addRowForHour(timestampUnix, isSameHour, lastKnown7d)
  }

  // Generate complete 30d chart (hourly points)
  const lastKnown30d = new Map<string, number>()

  for (let i = pointsNeededFor30dChart - 1; i >= 0; i--) {
    const pointTime = nowStartOfHour.subtract(i, 'hours')
    const timestampUnix = pointTime.unix()
    const isSameHour = pointTime.isSame(nowStartOfHour)

    addRowForHour30d(timestampUnix, isSameHour, lastKnown30d)
  }

  // Generate complete daily charts (90d, 6m, 1y)
  const lastKnown90d = new Map<string, number>()

  for (let i = pointsNeededFor90dChart - 1; i >= 0; i--) {
    const pointTime = nowStartOfDay.subtract(i, 'days')
    const timestampUnix = pointTime.unix()
    const isSameDay = pointTime.isSame(nowStartOfDay)

    addRowForDay('90d', timestampUnix, isSameDay, lastKnown90d)
  }

  const lastKnown6m = new Map<string, number>()

  for (let i = pointsNeededFor6mChart - 1; i >= 0; i--) {
    const pointTime = nowStartOfDay.subtract(i, 'days')
    const timestampUnix = pointTime.unix()
    const isSameDay = pointTime.isSame(nowStartOfDay)

    addRowForDay('6m', timestampUnix, isSameDay, lastKnown6m)
  }

  const lastKnown1y = new Map<string, number>()

  for (let i = pointsNeededFor1yChart - 1; i >= 0; i--) {
    const pointTime = nowStartOfDay.subtract(i, 'days')
    const timestampUnix = pointTime.unix()
    const isSameDay = pointTime.isSame(nowStartOfDay)

    addRowForDay('1y', timestampUnix, isSameDay, lastKnown1y)
  }

  // Generate complete 3y chart (weekly points)
  const lastKnownWeekly = new Map<string, number>()

  for (let i = pointsNeededFor3yChart - 1; i >= 0; i--) {
    const pointTime = nowStartOfWeek.subtract(i, 'weeks')
    const timestampUnix = pointTime.unix()
    const isSameWeek = pointTime.isSame(nowStartOfWeek)

    addRowForWeek(timestampUnix, isSameWeek, lastKnownWeekly)
  }

  return {
    data: chartBaseData,
    colors,
    dataNames,
  }
}
