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

  const thresholdHistorical7d = nowStartOfHour.subtract(Math.ceil(7), 'day').unix()
  const thresholdHistorical30d = nowStartOfHour.subtract(Math.ceil(30), 'day').unix()
  const thresholdHistorical90d = nowStartOfDay.subtract(Math.ceil(90), 'day').unix()
  const thresholdHistorical6m = nowStartOfDay.subtract(Math.ceil(6), 'month').unix()
  const thresholdHistorical1y = nowStartOfDay.subtract(Math.ceil(1), 'year').unix()
  const thresholdHistorical3y = nowStartOfWeek.subtract(Math.ceil(3), 'year').unix()

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
  positionHistory.position?.hourlyPositionHistory.reverse().forEach((point) => {
    const timestamp = dayjs(point.timestamp * 1000).startOf('hour')
    const timestampParsed = timestamp.format(CHART_TIMESTAMP_FORMAT_DETAILED)
    const timestampUnix = timestamp.unix()

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
  positionHistory.position?.dailyPositionHistory.reverse().forEach((point) => {
    const timestamp = dayjs(point.timestamp * 1000).startOf('day')
    const timestampParsed = timestamp.format(CHART_TIMESTAMP_FORMAT_DETAILED)
    const timestampUnix = timestamp.unix()

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
  positionHistory.position?.weeklyPositionHistory.reverse().forEach((point) => {
    const timestamp = dayjs(point.timestamp * 1000).startOf('week')
    const timestampParsed = timestamp.format(CHART_TIMESTAMP_FORMAT_DETAILED)
    const timestampUnix = timestamp.unix()

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
