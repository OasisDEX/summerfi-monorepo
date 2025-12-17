import { getUniqueColor } from '@summerfi/app-earn-ui'
import {
  type ChartsDataTimeframes,
  type MultipleSourceChartData,
} from '@summerfi/app-types/types/src/earn-protocol'
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
  }[]
}): MultipleSourceChartData => {
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

  performanceDataArray.forEach(({ performanceData }) => {
    const vaultLabel = getInstiVaultNiceName({
      network: supportedSDKNetwork(performanceData.vault.protocol.network),
      symbol: performanceData.vault.inputToken.symbol,
      institutionName,
    })

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

  // Helper to aggregate a single row across all vaults
  const addRowForHour = (timestampUnix: number, isCurrent: boolean) => {
    const row: ChartRow = {
      timestamp: timestampUnix,
      timestampParsed: dayjs.unix(timestampUnix).format(CHART_TIMESTAMP_FORMAT_DETAILED),
    }

    performanceDataArray.forEach(({ performanceData, pointName, currentPointValue }) => {
      const vaultLabel = getInstiVaultNiceName({
        network: supportedSDKNetwork(performanceData.vault.protocol.network),
        symbol: performanceData.vault.inputToken.symbol,
        institutionName,
      })
      const existingPoint = perVaultHourly.get(vaultLabel)?.get(timestampUnix)

      row[vaultLabel] = Number(
        isCurrent ? currentPointValue : existingPoint ? existingPoint[pointName] : 0,
      )
    })

    chartBaseData['7d'].push(row)
  }

  const addRowForHour30d = (timestampUnix: number, isCurrent: boolean) => {
    const row: ChartRow = {
      timestamp: timestampUnix,
      timestampParsed: dayjs.unix(timestampUnix).format(CHART_TIMESTAMP_FORMAT_DETAILED),
    }

    performanceDataArray.forEach(({ performanceData, pointName, currentPointValue }) => {
      const vaultLabel = getInstiVaultNiceName({
        network: supportedSDKNetwork(performanceData.vault.protocol.network),
        symbol: performanceData.vault.inputToken.symbol,
        institutionName,
      })
      const existingPoint = perVaultHourly.get(vaultLabel)?.get(timestampUnix)

      row[vaultLabel] = Number(
        isCurrent ? currentPointValue : existingPoint ? existingPoint[pointName] : 0,
      )
    })

    chartBaseData['30d'].push(row)
  }

  const addRowForDay = (
    timeframe: '90d' | '6m' | '1y',
    timestampUnix: number,
    isCurrent: boolean,
  ) => {
    const row: ChartRow = {
      timestamp: timestampUnix,
      timestampParsed: dayjs.unix(timestampUnix).format(CHART_TIMESTAMP_FORMAT_DETAILED),
    }

    performanceDataArray.forEach(({ performanceData, pointName, currentPointValue }) => {
      const vaultLabel = getInstiVaultNiceName({
        network: supportedSDKNetwork(performanceData.vault.protocol.network),
        symbol: performanceData.vault.inputToken.symbol,
        institutionName,
      })
      const existingPoint = perVaultDaily.get(vaultLabel)?.get(timestampUnix)

      row[vaultLabel] = Number(
        isCurrent ? currentPointValue : existingPoint ? existingPoint[pointName] : 0,
      )
    })

    chartBaseData[timeframe].push(row)
  }

  const addRowForWeek = (timestampUnix: number, isCurrent: boolean) => {
    const row: ChartRow = {
      timestamp: timestampUnix,
      timestampParsed: dayjs.unix(timestampUnix).format(CHART_TIMESTAMP_FORMAT_DETAILED),
    }

    performanceDataArray.forEach(({ performanceData, pointName, currentPointValue }) => {
      const vaultLabel = getInstiVaultNiceName({
        network: supportedSDKNetwork(performanceData.vault.protocol.network),
        symbol: performanceData.vault.inputToken.symbol,
        institutionName,
      })
      const existingPoint = perVaultWeekly.get(vaultLabel)?.get(timestampUnix)

      row[vaultLabel] = Number(
        isCurrent ? currentPointValue : existingPoint ? existingPoint[pointName] : 0,
      )
    })

    chartBaseData['3y'].push(row)
  }

  // Generate complete 7d chart (hourly points)
  for (let i = pointsNeededFor7dChart - 1; i >= 0; i--) {
    const pointTime = nowStartOfHour.subtract(i, 'hours')
    const timestampUnix = pointTime.unix()
    const isSameHour = pointTime.isSame(nowStartOfHour)

    addRowForHour(timestampUnix, isSameHour)
  }

  // Generate complete 30d chart (hourly points)
  for (let i = pointsNeededFor30dChart - 1; i >= 0; i--) {
    const pointTime = nowStartOfHour.subtract(i, 'hours')
    const timestampUnix = pointTime.unix()
    const isSameHour = pointTime.isSame(nowStartOfHour)

    addRowForHour30d(timestampUnix, isSameHour)
  }

  // Generate complete daily charts (90d, 6m, 1y)
  for (let i = pointsNeededFor90dChart - 1; i >= 0; i--) {
    const pointTime = nowStartOfDay.subtract(i, 'days')
    const timestampUnix = pointTime.unix()
    const isSameDay = pointTime.isSame(nowStartOfDay)

    addRowForDay('90d', timestampUnix, isSameDay)
  }

  for (let i = pointsNeededFor6mChart - 1; i >= 0; i--) {
    const pointTime = nowStartOfDay.subtract(i, 'days')
    const timestampUnix = pointTime.unix()
    const isSameDay = pointTime.isSame(nowStartOfDay)

    addRowForDay('6m', timestampUnix, isSameDay)
  }

  for (let i = pointsNeededFor1yChart - 1; i >= 0; i--) {
    const pointTime = nowStartOfDay.subtract(i, 'days')
    const timestampUnix = pointTime.unix()
    const isSameDay = pointTime.isSame(nowStartOfDay)

    addRowForDay('1y', timestampUnix, isSameDay)
  }

  // Generate complete 3y chart (weekly points)
  for (let i = pointsNeededFor3yChart - 1; i >= 0; i--) {
    const pointTime = nowStartOfWeek.subtract(i, 'weeks')
    const timestampUnix = pointTime.unix()
    const isSameWeek = pointTime.isSame(nowStartOfWeek)

    addRowForWeek(timestampUnix, isSameWeek)
  }

  return {
    data: chartBaseData,
    colors,
    dataNames,
  }
}
