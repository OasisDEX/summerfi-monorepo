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
import { CHART_TIMESTAMP_FORMAT_DETAILED } from '@/constants/charts'

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

  const pointsNeededFor7dChart = now.diff(nowStartOfHour.subtract(7, 'day'), 'hours')
  const pointsNeededFor30dChart = now.diff(nowStartOfHour.subtract(30, 'day'), 'hours')
  const pointsNeededFor90dChart = now.diff(nowStartOfDay.subtract(90, 'day'), 'days')
  const pointsNeededFor6mChart = now.diff(nowStartOfDay.subtract(6, 'month'), 'days')
  const pointsNeededFor1yChart = now.diff(nowStartOfDay.subtract(1, 'year'), 'days')
  const pointsNeededFor3yChart = now.diff(nowStartOfWeek.subtract(3, 'year'), 'weeks')

  const thresholdForecast7d = nowStartOfHour.add(7, 'day').unix()
  const thresholdForecast30d = nowStartOfHour.add(30, 'day').unix()
  const thresholdForecast90d = nowStartOfDay.add(90, 'day').unix()
  const thresholdForecast6m = nowStartOfDay.add(6, 'month').unix()
  const thresholdForecast1y = nowStartOfDay.add(1, 'year').unix()
  const thresholdForecast3y = nowStartOfWeek.add(3, 'year').unix()

  const chartBaseData: ChartsDataTimeframes = {
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

  const inputTokenDecimals = position?.amount.token.decimals ?? 2

  // Create maps for quick lookup of historical data
  const hourlyDataMap = new Map<
    number,
    NonNullable<
      GetPositionHistoryReturnType['positionHistory']['position']
    >['hourlyPositionHistory'][number]
  >()
  const dailyDataMap = new Map<
    number,
    NonNullable<
      GetPositionHistoryReturnType['positionHistory']['position']
    >['dailyPositionHistory'][number]
  >()
  const weeklyDataMap = new Map<
    number,
    NonNullable<
      GetPositionHistoryReturnType['positionHistory']['position']
    >['weeklyPositionHistory'][number]
  >()

  // Populate maps with existing data
  positionHistory.positionHistory.position?.hourlyPositionHistory.forEach((point) => {
    hourlyDataMap.set(
      dayjs(point.timestamp * 1000)
        .startOf('hour')
        .unix(),
      point,
    )
  })

  positionHistory.positionHistory.position?.dailyPositionHistory.forEach((point) => {
    dailyDataMap.set(
      dayjs(point.timestamp * 1000)
        .startOf('day')
        .unix(),
      point,
    )
  })

  positionHistory.positionHistory.position?.weeklyPositionHistory.forEach((point) => {
    weeklyDataMap.set(
      dayjs(point.timestamp * 1000)
        .startOf('week')
        .unix(),
      point,
    )
  })

  const positionValues = position && vault ? getPositionValues({ position, vault }) : false

  // forecast hourly points
  positionForecast.dataPoints.hourly.forEach((point, pointIndex) => {
    const timestamp = dayjs(point.timestamp, 'YYYY-MM-DD HH:mm:ss').startOf('hour')
    const timestampParsed = timestamp.format(CHART_TIMESTAMP_FORMAT_DETAILED)

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
    const timestampParsed = timestamp.format(CHART_TIMESTAMP_FORMAT_DETAILED)

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
    const timestampParsed = timestamp.format(CHART_TIMESTAMP_FORMAT_DETAILED)

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

  // Generate complete 7d chart (hourly points)
  for (let i = pointsNeededFor7dChart - 1; i >= 0; i--) {
    const pointTime = nowStartOfHour.subtract(i, 'hours')
    const timestampUnix = pointTime.unix()
    const timestampParsed = pointTime.format(CHART_TIMESTAMP_FORMAT_DETAILED)
    const isSameHour = pointTime.isSame(nowStartOfHour)

    const existingPoint = hourlyDataMap.get(timestampUnix)

    if (existingPoint) {
      const pointNetValue =
        isSameHour && positionValues
          ? Number(positionValues.netValue.toFixed(inputTokenDecimals))
          : existingPoint.netValue
      const pointDepositedValue =
        isSameHour && positionValues
          ? Number(positionValues.netDeposited.toFixed(inputTokenDecimals))
          : Math.max(Math.abs(existingPoint.deposits) - Math.abs(existingPoint.withdrawals), 0)

      chartBaseData['7d'].push({
        timestamp: timestampUnix,
        timestampParsed,
        netValue: pointNetValue,
        depositedValue: pointDepositedValue,
      })
    } else {
      const backfillPointData = {
        timestamp: timestampUnix,
        timestampParsed,
        netValue: 0,
        depositedValue: 0,
      }

      chartBaseData['7d'].push(backfillPointData)
    }
  }

  // Generate complete 30d chart (hourly points)
  for (let i = pointsNeededFor30dChart - 1; i >= 0; i--) {
    const pointTime = nowStartOfHour.subtract(i, 'hours')
    const timestampUnix = pointTime.unix()
    const timestampParsed = pointTime.format(CHART_TIMESTAMP_FORMAT_DETAILED)
    const isSameHour = pointTime.isSame(nowStartOfHour)

    const existingPoint = hourlyDataMap.get(timestampUnix)

    if (existingPoint) {
      const pointNetValue =
        isSameHour && positionValues
          ? Number(positionValues.netValue.toFixed(inputTokenDecimals))
          : existingPoint.netValue
      const pointDepositedValue =
        isSameHour && positionValues
          ? Number(positionValues.netDeposited.toFixed(inputTokenDecimals))
          : Math.max(Math.abs(existingPoint.deposits) - Math.abs(existingPoint.withdrawals), 0)

      chartBaseData['30d'].push({
        timestamp: timestampUnix,
        timestampParsed,
        netValue: pointNetValue,
        depositedValue: pointDepositedValue,
      })
    } else {
      const backfillPointData = {
        timestamp: timestampUnix,
        timestampParsed,
        netValue: 0,
        depositedValue: 0,
      }

      chartBaseData['30d'].push(backfillPointData)
    }
  }

  // Generate complete daily charts (90d, 6m, 1y)
  const generateDailyChart = (timeframe: '90d' | '6m' | '1y', pointsNeeded: number) => {
    for (let i = pointsNeeded - 1; i >= 0; i--) {
      const pointTime = nowStartOfDay.subtract(i, 'days')
      const timestampUnix = pointTime.unix()
      const timestampParsed = pointTime.format(CHART_TIMESTAMP_FORMAT_DETAILED)
      const isSameDay = pointTime.isSame(nowStartOfDay)

      const existingPoint = dailyDataMap.get(timestampUnix)

      if (existingPoint) {
        const pointNetValue =
          isSameDay && positionValues
            ? Number(positionValues.netValue.toFixed(inputTokenDecimals))
            : existingPoint.netValue
        const pointDepositedValue =
          isSameDay && positionValues
            ? Number(positionValues.netDeposited.toFixed(inputTokenDecimals))
            : Math.max(Math.abs(existingPoint.deposits) - Math.abs(existingPoint.withdrawals), 0)

        chartBaseData[timeframe].push({
          timestamp: timestampUnix,
          timestampParsed,
          netValue: pointNetValue,
          depositedValue: pointDepositedValue,
        })
      } else {
        const backfillPointData = {
          timestamp: timestampUnix,
          timestampParsed,
          netValue: 0,
          depositedValue: 0,
        }

        chartBaseData[timeframe].push(backfillPointData)
      }
    }
  }

  generateDailyChart('90d', pointsNeededFor90dChart)

  generateDailyChart('6m', pointsNeededFor6mChart)

  generateDailyChart('1y', pointsNeededFor1yChart)

  // Generate complete 3y chart (weekly points)
  for (let i = pointsNeededFor3yChart - 1; i >= 0; i--) {
    const pointTime = nowStartOfWeek.subtract(i, 'weeks')
    const timestampUnix = pointTime.unix()
    const timestampParsed = pointTime.format(CHART_TIMESTAMP_FORMAT_DETAILED)
    const isSameWeek = pointTime.isSame(nowStartOfWeek)

    const existingPoint = weeklyDataMap.get(timestampUnix)

    if (existingPoint) {
      const pointNetValue =
        isSameWeek && positionValues
          ? Number(positionValues.netValue.toFixed(inputTokenDecimals))
          : existingPoint.netValue
      const pointDepositedValue =
        isSameWeek && positionValues
          ? Number(positionValues.netDeposited.toFixed(inputTokenDecimals))
          : Math.max(Math.abs(existingPoint.deposits) - Math.abs(existingPoint.withdrawals), 0)

      chartBaseData['3y'].push({
        timestamp: timestampUnix,
        timestampParsed,
        netValue: pointNetValue,
        depositedValue: pointDepositedValue,
      })
    } else {
      const backfillPointData = {
        timestamp: timestampUnix,
        timestampParsed,
        netValue: 0,
        depositedValue: 0,
      }

      chartBaseData['3y'].push(backfillPointData)
    }
  }

  return {
    historic: chartBaseData,
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
