import { getPositionValues } from '@summerfi/app-earn-ui'
import {
  type ChartsDataTimeframes,
  type HistoryChartData,
  type IArmadaPosition,
  type SDKVaultishType,
} from '@summerfi/app-types'
import dayjs from 'dayjs'

import { type GetPositionHistoryReturnType } from '@/app/server-handlers/position-history'
import { CHART_TIMESTAMP_FORMAT_DETAILED } from '@/constants/charts'

const mapPositionHistory = (
  positionHistory: GetPositionHistoryReturnType['positionHistory'],
  position?: IArmadaPosition,
  vault?: SDKVaultishType,
): HistoryChartData => {
  const now = dayjs()
  const nowStartOfHour = now.startOf('hour')
  const nowStartOfDay = now.startOf('day')
  const nowStartOfWeek = now.startOf('week')

  const thresholdHistorical7d = nowStartOfHour.subtract(7, 'day').unix()
  const thresholdHistorical30d = nowStartOfHour.subtract(30, 'day').unix()
  const thresholdHistorical90d = nowStartOfDay.subtract(90, 'day').unix()
  const thresholdHistorical6m = nowStartOfDay.subtract(6, 'month').unix()
  const thresholdHistorical1y = nowStartOfDay.subtract(1, 'year').unix()
  const thresholdHistorical3y = nowStartOfWeek.subtract(3, 'year').unix()

  const chartBaseData: ChartsDataTimeframes = {
    '7d': [], // hourly
    '30d': [], // hourly
    '90d': [], // daily
    '6m': [], // daily
    '1y': [], // daily
    '3y': [], // weekly
  }

  const pointsNeededToDisplayAnyGraph = 1 // 1 hours
  const inputTokenDecimals = position?.amount.token.decimals ?? 2

  const positionValues =
    position && vault
      ? getPositionValues({
          position,
          vault,
        })
      : false

  if (
    (positionHistory.position?.hourlyPositionHistory.length ?? 0) < pointsNeededToDisplayAnyGraph
  ) {
    return {
      data: chartBaseData,
    }
  }

  // history hourly points
  positionHistory.position?.hourlyPositionHistory.reverse().forEach((point, pointIndex) => {
    const timestamp = dayjs(point.timestamp * 1000).startOf('hour')
    const timestampParsed = timestamp.format(CHART_TIMESTAMP_FORMAT_DETAILED)
    const timestampUnix = timestamp.unix()

    // backfill the hourly position history with 0 values
    if (pointIndex === 0) {
      const chartStartTime7d = dayjs(thresholdHistorical7d * 1000).subtract(7, 'days')
      const chartStartTime30d = dayjs(thresholdHistorical30d * 1000).subtract(30, 'days')
      const hoursNeededFor7dChart = timestamp.diff(chartStartTime7d, 'hours')
      const hoursNeededFor30dChart = timestamp.diff(chartStartTime30d, 'hours')

      if (hoursNeededFor7dChart > 0) {
        for (let i = 0; i < hoursNeededFor7dChart; i++) {
          const backfillTimestamp = chartStartTime7d.add(i, 'hour')
          const backfillPointData = {
            timestamp: backfillTimestamp.unix(),
            timestampParsed: backfillTimestamp.format(CHART_TIMESTAMP_FORMAT_DETAILED),
            netValue: 0,
            depositedValue: 0,
          }

          chartBaseData['7d'].push(backfillPointData)
        }
      }

      if (hoursNeededFor30dChart > 0) {
        for (let i = 0; i < hoursNeededFor30dChart; i++) {
          const backfillTimestamp = chartStartTime30d.add(i, 'hour')
          const backfillPointData = {
            timestamp: backfillTimestamp.unix(),
            timestampParsed: backfillTimestamp.format(CHART_TIMESTAMP_FORMAT_DETAILED),
            netValue: 0,
            depositedValue: 0,
          }

          chartBaseData['30d'].push(backfillPointData)
        }
      }
    }

    const isSameHour = timestamp.isSame(nowStartOfHour)

    const pointNetValue =
      isSameHour && positionValues
        ? Number(positionValues.netValue.toFixed(inputTokenDecimals))
        : point.netValue
    const pointDepositedValue =
      isSameHour && positionValues
        ? Number(positionValues.netDeposited.toFixed(inputTokenDecimals))
        : Math.max(Math.abs(point.deposits) - Math.abs(point.withdrawals), 0)
    const newPointData = {
      timestamp: timestampUnix,
      timestampParsed,
      netValue: pointNetValue,
      depositedValue: pointDepositedValue,
    }

    if (timestampUnix >= thresholdHistorical7d) {
      chartBaseData['7d'].push(newPointData)
    }
    if (timestampUnix >= thresholdHistorical30d) {
      chartBaseData['30d'].push(newPointData)
    }
  })

  // history daily points
  positionHistory.position?.dailyPositionHistory.reverse().forEach((point, pointIndex) => {
    const timestamp = dayjs(point.timestamp * 1000).startOf('day')
    const timestampParsed = timestamp.format(CHART_TIMESTAMP_FORMAT_DETAILED)
    const timestampUnix = timestamp.unix()

    // backfill the daily position history with 0 values
    if (pointIndex === 0) {
      const chartStartTime90d = dayjs(thresholdHistorical90d * 1000).subtract(90, 'days')
      const chartStartTime6m = dayjs(thresholdHistorical6m * 1000).subtract(6, 'months')
      const chartStartTime1y = dayjs(thresholdHistorical1y * 1000).subtract(1, 'year')
      const daysNeededFor90dChart = timestamp.diff(chartStartTime90d, 'days')
      const daysNeededFor6mChart = timestamp.diff(chartStartTime6m, 'days')
      const daysNeededFor1yChart = timestamp.diff(chartStartTime1y, 'days')

      if (daysNeededFor90dChart > 0) {
        for (let i = 0; i < daysNeededFor90dChart; i++) {
          const backfillTimestamp = chartStartTime90d.add(i, 'day')
          const backfillPointData = {
            timestamp: backfillTimestamp.unix(),
            timestampParsed: backfillTimestamp.format(CHART_TIMESTAMP_FORMAT_DETAILED),
            netValue: 0,
            depositedValue: 0,
          }

          chartBaseData['90d'].push(backfillPointData)
        }
      }
      if (daysNeededFor6mChart > 0) {
        for (let i = 0; i < daysNeededFor6mChart; i++) {
          const backfillTimestamp = chartStartTime6m.add(i, 'day')
          const backfillPointData = {
            timestamp: backfillTimestamp.unix(),
            timestampParsed: backfillTimestamp.format(CHART_TIMESTAMP_FORMAT_DETAILED),
            netValue: 0,
            depositedValue: 0,
          }

          chartBaseData['6m'].push(backfillPointData)
        }
      }
      if (daysNeededFor1yChart > 0) {
        for (let i = 0; i < daysNeededFor1yChart; i++) {
          const backfillTimestamp = chartStartTime1y.add(i, 'day')
          const backfillPointData = {
            timestamp: backfillTimestamp.unix(),
            timestampParsed: backfillTimestamp.format(CHART_TIMESTAMP_FORMAT_DETAILED),
            netValue: 0,
            depositedValue: 0,
          }

          chartBaseData['1y'].push(backfillPointData)
        }
      }
    }

    const isSameDay = timestamp.isSame(nowStartOfDay)

    const pointNetValue =
      isSameDay && positionValues
        ? Number(positionValues.netValue.toFixed(inputTokenDecimals))
        : point.netValue
    const pointDepositedValue =
      isSameDay && positionValues
        ? Number(positionValues.netDeposited.toFixed(inputTokenDecimals))
        : Math.max(Math.abs(point.deposits) - Math.abs(point.withdrawals), 0)
    const newPointData = {
      timestamp: timestampUnix,
      timestampParsed,
      netValue: pointNetValue,
      depositedValue: pointDepositedValue,
    }

    if (timestampUnix >= thresholdHistorical90d) {
      chartBaseData['90d'].push(newPointData)
    }
    if (timestampUnix >= thresholdHistorical6m) {
      chartBaseData['6m'].push(newPointData)
    }
    if (timestampUnix >= thresholdHistorical1y) {
      chartBaseData['1y'].push(newPointData)
    }
  })

  // history weekly points
  positionHistory.position?.weeklyPositionHistory.reverse().forEach((point, pointIndex) => {
    const timestamp = dayjs(point.timestamp * 1000).startOf('week')
    const timestampParsed = timestamp.format(CHART_TIMESTAMP_FORMAT_DETAILED)
    const timestampUnix = timestamp.unix()

    // backfill the weekly position history with 0 values
    if (pointIndex === 0) {
      const chartStartTime3y = dayjs(thresholdHistorical3y * 1000).subtract(3, 'years')
      const weeksNeededFor3yChart = timestamp.diff(chartStartTime3y, 'weeks')

      for (let i = 0; i < weeksNeededFor3yChart; i++) {
        const backfillTimestamp = chartStartTime3y.add(i, 'week')
        const backfillPointData = {
          timestamp: backfillTimestamp.unix(),
          timestampParsed: backfillTimestamp.format(CHART_TIMESTAMP_FORMAT_DETAILED),
          netValue: 0,
          depositedValue: 0,
        }

        chartBaseData['3y'].push(backfillPointData)
      }
    }

    const isSameWeek = timestamp.isSame(nowStartOfWeek)

    const pointNetValue =
      isSameWeek && positionValues
        ? Number(positionValues.netValue.toFixed(inputTokenDecimals))
        : point.netValue
    const pointDepositedValue =
      isSameWeek && positionValues
        ? Number(positionValues.netDeposited.toFixed(inputTokenDecimals))
        : Math.max(Math.abs(point.deposits) - Math.abs(point.withdrawals), 0)
    const newPointData = {
      timestamp: timestampUnix,
      timestampParsed,
      netValue: pointNetValue,
      depositedValue: pointDepositedValue,
    }

    if (timestampUnix >= thresholdHistorical3y) {
      chartBaseData['3y'].push(newPointData)
    }
  })

  return {
    data: chartBaseData,
  }
}

export const getPositionHistoricalData = ({
  positionHistory,
  vault,
  position,
}: {
  vault: SDKVaultishType
  position?: IArmadaPosition
  positionHistory: GetPositionHistoryReturnType['positionHistory']
}) => {
  return mapPositionHistory(positionHistory, position, vault)
}
