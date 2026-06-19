import { type ChartsDataTimeframes, type SingleSourceChartData } from '@summerfi/app-types'
import dayjs from 'dayjs'

import { type GetRwaVaultNavHistoryReturnType } from '@/app/server-handlers/cached/get-rwa-vault-nav-history'
import { CHART_TIMESTAMP_FORMAT_DETAILED } from '@/constants/charts'

type NavSnapshot = { timestamp: number; navPrice?: number | null }

const SECONDS_PER_DAY = 86_400

// Maps the RWA vault NAV (pricePerShare) snapshots into the timeframe-bucketed shape the chart
// expects. Mirrors get-position-historical-data / mapSinglePointChartData (7d/30d hourly, 90d/6m/1y
// daily, 3y weekly) but emits a single `navPrice` series. Buckets without a snapshot omit the
// `navPrice` key so the line renders a gap (connectNulls bridges it) rather than dropping to 0,
// which would otherwise wreck the NAV line and its auto-scaled YAxis.
//
// `skipFirstNDays` (the vault's configured `navPriceSkipFirstNDays`) drops snapshots from the vault's
// first N days — the inception window where NAV can swing out of bounds — so the chart, and the APY
// derived from it, ignore those volatile early days, consistent with the navApy30d stat
// (getNavPriceChange30d). No-op when 0 or when the vault has no usable created timestamp.
export const getRwaNavHistoricalData = ({
  navHistory,
  skipFirstNDays = 0,
  vaultCreatedTimestamp,
}: {
  navHistory: GetRwaVaultNavHistoryReturnType
  skipFirstNDays?: number
  vaultCreatedTimestamp?: number | string | bigint
}): SingleSourceChartData => {
  const createdTs = Number(vaultCreatedTimestamp)
  const skipBeforeTimestamp =
    skipFirstNDays > 0 && Number.isFinite(createdTs)
      ? createdTs + Number(skipFirstNDays * SECONDS_PER_DAY)
      : undefined

  // Snapshots within the inception skip window are excluded before bucketing, so their buckets stay
  // empty (rendered as gaps) and never feed the NAV line or the APY series.
  const isAfterSkipWindow = (point: NavSnapshot) =>
    skipBeforeTimestamp == null || point.timestamp >= skipBeforeTimestamp

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

  const chartBaseData: ChartsDataTimeframes = {
    '7d': [], // hourly
    '30d': [], // hourly
    '90d': [], // daily
    '6m': [], // daily
    '1y': [], // daily
    '3y': [], // weekly
  }

  const hourlyDataMap = new Map<number, NavSnapshot>()
  const dailyDataMap = new Map<number, NavSnapshot>()
  const weeklyDataMap = new Map<number, NavSnapshot>()

  navHistory.vault?.hourlyVaultHistory.forEach((point) => {
    if (!isAfterSkipWindow(point)) {
      return
    }
    hourlyDataMap.set(
      dayjs(point.timestamp * 1000)
        .startOf('hour')
        .unix(),
      point,
    )
  })

  navHistory.vault?.dailyVaultHistory.forEach((point) => {
    if (!isAfterSkipWindow(point)) {
      return
    }
    dailyDataMap.set(
      dayjs(point.timestamp * 1000)
        .startOf('day')
        .unix(),
      point,
    )
  })

  navHistory.vault?.weeklyVaultHistory.forEach((point) => {
    if (!isAfterSkipWindow(point)) {
      return
    }
    weeklyDataMap.set(
      dayjs(point.timestamp * 1000)
        .startOf('week')
        .unix(),
      point,
    )
  })

  const pushPoint = (
    timeframe: keyof ChartsDataTimeframes,
    timestampUnix: number,
    timestampParsed: string,
    snapshot?: NavSnapshot,
  ) => {
    // Omit `navPrice` when there's no snapshot (or a null NAV) so the chart shows a gap.
    if (snapshot?.navPrice != null) {
      chartBaseData[timeframe].push({
        timestamp: timestampUnix,
        timestampParsed,
        navPrice: Number(snapshot.navPrice),
      })
    } else {
      chartBaseData[timeframe].push({
        timestamp: timestampUnix,
        timestampParsed,
      })
    }
  }

  // 7d + 30d - hourly buckets
  const generateHourlyChart = (timeframe: '7d' | '30d', pointsNeeded: number) => {
    for (let i = pointsNeeded - 1; i >= 0; i--) {
      const pointTime = nowStartOfHour.subtract(i, 'hours')

      pushPoint(
        timeframe,
        pointTime.unix(),
        pointTime.format(CHART_TIMESTAMP_FORMAT_DETAILED),
        hourlyDataMap.get(pointTime.unix()),
      )
    }
  }

  generateHourlyChart('7d', pointsNeededFor7dChart)
  generateHourlyChart('30d', pointsNeededFor30dChart)

  // 90d + 6m + 1y - daily buckets
  const generateDailyChart = (timeframe: '90d' | '6m' | '1y', pointsNeeded: number) => {
    for (let i = pointsNeeded - 1; i >= 0; i--) {
      const pointTime = nowStartOfDay.subtract(i, 'days')

      pushPoint(
        timeframe,
        pointTime.unix(),
        pointTime.format(CHART_TIMESTAMP_FORMAT_DETAILED),
        dailyDataMap.get(pointTime.unix()),
      )
    }
  }

  generateDailyChart('90d', pointsNeededFor90dChart)
  generateDailyChart('6m', pointsNeededFor6mChart)
  generateDailyChart('1y', pointsNeededFor1yChart)

  // 3y - weekly buckets
  for (let i = pointsNeededFor3yChart - 1; i >= 0; i--) {
    const pointTime = nowStartOfWeek.subtract(i, 'weeks')

    pushPoint(
      '3y',
      pointTime.unix(),
      pointTime.format(CHART_TIMESTAMP_FORMAT_DETAILED),
      weeklyDataMap.get(pointTime.unix()),
    )
  }

  return {
    data: chartBaseData,
  }
}
