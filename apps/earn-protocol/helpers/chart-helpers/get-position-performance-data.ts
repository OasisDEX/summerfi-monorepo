import { getPositionValues } from '@summerfi/app-earn-ui'
import {
  type ChartsDataTimeframes,
  type ForecastData,
  type IArmadaPosition,
  type PerformanceChartData,
  type SDKVaultishType,
} from '@summerfi/app-types'
import dayjs from 'dayjs'

import { type GetPositionHistoryReturnType } from '@/app/server-handlers/position-history'
import { CHART_TIMESTAMP_FORMAT } from '@/constants/charts'

const preparePositionHistoryAndForecast = (
  positionHistory: GetPositionHistoryReturnType,
  positionForecast: ForecastData,
  position?: IArmadaPosition,
  vault?: SDKVaultishType,
): PerformanceChartData => {
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

  const thresholdForecast7d = nowStartOfHour.add(7, 'day').unix()
  const thresholdForecast30d = nowStartOfHour.add(30, 'day').unix()
  const thresholdForecast90d = nowStartOfDay.add(90, 'day').unix()
  const thresholdForecast6m = nowStartOfDay.add(6, 'month').unix()
  const thresholdForecast1y = nowStartOfDay.add(1, 'year').unix()
  const thresholdForecast3y = nowStartOfWeek.add(3, 'year').unix()

  const chartHistoricData: ChartsDataTimeframes = {
    '7d': [], // hourly
    '30d': [], // hourly
    '90d': [], // daily
    '6m': [], // daily
    '1y': [], // daily
    '3y': [], // weekly
  }

  const chartForecastData: ChartsDataTimeframes = {
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

  const { dailyPositionHistory, hourlyPositionHistory, weeklyPositionHistory } =
    positionHistory.positionHistory.position ?? {}

  // forecast hourly points
  positionForecast.dataPoints.hourly.forEach((point, pointIndex) => {
    const timestamp = dayjs(point.timestamp, 'YYYY-MM-DD HH:mm:ss').startOf('hour')
    const timestampParsed = timestamp.format(CHART_TIMESTAMP_FORMAT)

    if (pointIndex === 0) {
      // first point in the forecast must be merged with
      // the last point in the history
      const last7dPoint = chartForecastData['7d'][chartForecastData['7d'].length - 1]
      const last30dPoint = chartForecastData['30d'][chartForecastData['30d'].length - 1]

      chartForecastData['7d'][chartForecastData['7d'].length - 1] = {
        ...last7dPoint,
        forecast: point.forecast,
        bounds: point.bounds,
      }
      chartForecastData['30d'][chartForecastData['30d'].length - 1] = {
        ...last30dPoint,
        forecast: point.forecast,
        bounds: point.bounds,
      }

      return
    }

    if (timestamp.unix() <= thresholdForecast7d) {
      chartForecastData['7d'].push({
        timestamp: timestamp.unix(),
        timestampParsed,
        forecast: point.forecast,
        bounds: point.bounds,
      })
    }
    if (timestamp.unix() <= thresholdForecast30d) {
      chartForecastData['30d'].push({
        timestamp: timestamp.unix(),
        timestampParsed,
        forecast: point.forecast,
        bounds: point.bounds,
      })
    }
  })

  // forecast daily points
  positionForecast.dataPoints.daily.forEach((point, pointIndex) => {
    const timestamp = dayjs(point.timestamp, 'YYYY-MM-DD HH:mm:ss').startOf('day')
    const timestampParsed = timestamp.format(CHART_TIMESTAMP_FORMAT)

    if (pointIndex === 0) {
      // first point in the forecast must be merged with
      // the last point in the history
      const last90dPoint = chartForecastData['90d'][chartForecastData['90d'].length - 1]
      const last6mPoint = chartForecastData['6m'][chartForecastData['6m'].length - 1]
      const last1yPoint = chartForecastData['1y'][chartForecastData['1y'].length - 1]

      chartForecastData['90d'][chartForecastData['90d'].length - 1] = {
        ...last90dPoint,
        forecast: point.forecast,
        bounds: point.bounds,
      }
      chartForecastData['6m'][chartForecastData['6m'].length - 1] = {
        ...last6mPoint,
        forecast: point.forecast,
        bounds: point.bounds,
      }
      chartForecastData['1y'][chartForecastData['1y'].length - 1] = {
        ...last1yPoint,
        forecast: point.forecast,
        bounds: point.bounds,
      }

      return
    }
    if (timestamp.unix() <= thresholdForecast90d) {
      chartForecastData['90d'].push({
        timestamp: timestamp.unix(),
        timestampParsed,
        forecast: point.forecast,
        bounds: point.bounds,
      })
    }
    if (timestamp.unix() <= thresholdForecast6m) {
      chartForecastData['6m'].push({
        timestamp: timestamp.unix(),
        timestampParsed,
        forecast: point.forecast,
        bounds: point.bounds,
      })
    }
    if (timestamp.unix() <= thresholdForecast1y) {
      chartForecastData['1y'].push({
        timestamp: timestamp.unix(),
        timestampParsed,
        forecast: point.forecast,
        bounds: point.bounds,
      })
    }
  })

  // forecast weekly points
  positionForecast.dataPoints.weekly.forEach((point, pointIndex) => {
    const timestamp = dayjs(point.timestamp, 'YYYY-MM-DD HH:mm:ss').startOf('week')
    const timestampParsed = timestamp.format(CHART_TIMESTAMP_FORMAT)

    if (pointIndex === 0) {
      // first point in the forecast must be merged with
      // the last point in the history
      const last3yPoint = chartForecastData['3y'][chartForecastData['3y'].length - 1]

      chartForecastData['3y'][chartForecastData['3y'].length - 1] = {
        ...last3yPoint,
        forecast: point.forecast,
        bounds: point.bounds,
      }

      return
    }

    if (timestamp.unix() <= thresholdForecast3y) {
      chartForecastData['3y'].push({
        timestamp: timestamp.unix(),
        timestampParsed,
        forecast: point.forecast,
        bounds: point.bounds,
      })
    }
  })

  if ((hourlyPositionHistory?.length ?? 0) < pointsNeededToDisplayAnyGraph) {
    return {
      historic: chartHistoricData,
      forecast: chartForecastData,
    }
  }

  // history hourly points
  hourlyPositionHistory?.reverse().forEach((point) => {
    const timestamp = dayjs(point.timestamp * 1000).startOf('hour')
    const timestampParsed = timestamp.format(CHART_TIMESTAMP_FORMAT)
    const timestampUnix = timestamp.unix()

    const isSameHour = timestamp.isSame(nowStartOfHour)

    const pointNetValue =
      isSameHour && positionValues
        ? Number(positionValues.netValue.toFixed(inputTokenDecimals))
        : point.netValue
    const pointDepositedValue =
      isSameHour && positionValues
        ? Number(positionValues.netDeposited.toFixed(inputTokenDecimals))
        : Math.max(point.deposits - Math.abs(point.withdrawals), 0)
    const newPointData = {
      timestamp: timestampUnix,
      timestampParsed,
      netValue: pointNetValue,
      depositedValue: pointDepositedValue,
    }

    if (timestampUnix >= thresholdHistorical7d) {
      chartHistoricData['7d'].push(newPointData)
    }
    if (timestampUnix >= thresholdHistorical30d) {
      chartHistoricData['30d'].push(newPointData)
    }
  })

  // history daily points
  dailyPositionHistory?.reverse().forEach((point) => {
    const timestamp = dayjs(point.timestamp * 1000).startOf('day')
    const timestampParsed = timestamp.format(CHART_TIMESTAMP_FORMAT)
    const timestampUnix = timestamp.unix()

    const isSameDay = timestamp.isSame(nowStartOfDay)

    const pointNetValue =
      isSameDay && positionValues
        ? Number(positionValues.netValue.toFixed(inputTokenDecimals))
        : point.netValue
    const pointDepositedValue =
      isSameDay && positionValues
        ? Number(positionValues.netDeposited.toFixed(inputTokenDecimals))
        : Math.max(point.deposits - Math.abs(point.withdrawals), 0)
    const newPointData = {
      timestamp: timestampUnix,
      timestampParsed,
      netValue: pointNetValue,
      depositedValue: pointDepositedValue,
    }

    if (timestampUnix >= thresholdHistorical90d) {
      chartHistoricData['90d'].push(newPointData)
    }
    if (timestampUnix >= thresholdHistorical6m) {
      chartHistoricData['6m'].push(newPointData)
    }
    if (timestampUnix >= thresholdHistorical1y) {
      chartHistoricData['1y'].push(newPointData)
    }
  })

  // history weekly points
  weeklyPositionHistory?.reverse().forEach((point) => {
    const timestamp = dayjs(point.timestamp * 1000).startOf('week')
    const timestampParsed = timestamp.format(CHART_TIMESTAMP_FORMAT)
    const timestampUnix = timestamp.unix()

    const isSameWeek = timestamp.isSame(nowStartOfWeek)

    const pointNetValue =
      isSameWeek && positionValues
        ? Number(positionValues.netValue.toFixed(inputTokenDecimals))
        : point.netValue
    const pointDepositedValue =
      isSameWeek && positionValues
        ? Number(positionValues.netDeposited.toFixed(inputTokenDecimals))
        : Math.max(point.deposits - Math.abs(point.withdrawals), 0)
    const newPointData = {
      timestamp: timestampUnix,
      timestampParsed,
      netValue: pointNetValue,
      depositedValue: pointDepositedValue,
    }

    if (timestampUnix >= thresholdHistorical3y) {
      chartHistoricData['3y'].push(newPointData)
    }
  })

  return {
    historic: chartHistoricData,
    forecast: chartForecastData,
  }
}

export const getPositionPerformanceData = ({
  vault,
  positionForecast,
  positionHistory,
  position,
}: {
  vault: SDKVaultishType
  positionHistory: GetPositionHistoryReturnType
  positionForecast: ForecastData
  position?: IArmadaPosition
}) => {
  return preparePositionHistoryAndForecast(positionHistory, positionForecast, position, vault)
}
