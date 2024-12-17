import {
  type ChartsDataTimeframes,
  type ForecastData,
  type SDKVaultishType,
  type VaultChartsPerformanceData,
} from '@summerfi/app-types'
import dayjs from 'dayjs'

import { type GetPositionHistoryReturnType } from '@/app/server-handlers/position-history'
import { CHART_TIMESTAMP_FORMAT } from '@/constants/charts'

const mergePositionHistoryAndForecast = (
  positionHistory: GetPositionHistoryReturnType,
  positionForecast: ForecastData,
): VaultChartsPerformanceData['performanceChartData'] => {
  const now = dayjs()
  const nowStartOfHour = now.startOf('hour')
  const nowStartOfDay = now.startOf('day')
  const nowStartOfWeek = now.startOf('week')

  // should be ~2/3 of the whole timeframe
  const thresholdHistorical7d = nowStartOfHour.subtract(Math.ceil(7 * (2 / 3)), 'day').unix()
  const thresholdHistorical30d = nowStartOfHour.subtract(Math.ceil(30 * (2 / 3)), 'day').unix()
  const thresholdHistorical90d = nowStartOfDay.subtract(Math.ceil(90 * (2 / 3)), 'day').unix()
  const thresholdHistorical6m = nowStartOfDay.subtract(Math.ceil(6 * (2 / 3)), 'month').unix()
  const thresholdHistorical1y = nowStartOfDay.subtract(Math.ceil(1 * (2 / 3)), 'year').unix()
  const thresholdHistorical3y = nowStartOfWeek.subtract(Math.ceil(3 * (2 / 3)), 'year').unix()

  // should be ~1/3 of the whole timeframe
  const thresholdForecast7d = nowStartOfHour.add(Math.ceil(7 * (1 / 3)), 'day').unix()
  const thresholdForecast30d = nowStartOfHour.add(Math.ceil(30 * (1 / 3)), 'day').unix()
  const thresholdForecast90d = nowStartOfDay.add(Math.ceil(90 * (1 / 3)), 'day').unix()
  const thresholdForecast6m = nowStartOfDay.add(Math.ceil(6 * (1 / 3)), 'month').unix()
  const thresholdForecast1y = nowStartOfDay.add(Math.ceil(1 * (1 / 3)), 'year').unix()
  const thresholdForecast3y = nowStartOfWeek.add(Math.ceil(3 * (1 / 3)), 'year').unix()

  const chartBaseData: ChartsDataTimeframes = {
    '7d': [], // hourly
    '30d': [], // hourly
    '90d': [], // daily
    '6m': [], // daily
    '1y': [], // daily
    '3y': [], // weekly
  }

  const forecastCutoff = {
    hourly: 240,
    daily: 122,
    weekly: 52,
  }

  // history hourly points
  positionHistory.position?.hourlyPositionHistory.reverse().forEach((point) => {
    const timestamp = dayjs(point.timestamp * 1000).startOf('hour')
    const timestampParsed = timestamp.format(CHART_TIMESTAMP_FORMAT)

    if (timestamp.unix() >= thresholdHistorical7d) {
      chartBaseData['7d'].push({
        timestamp: timestamp.unix(),
        timestampParsed,
        netValue: point.netValue,
        depositedValue: Math.max(point.deposits - Math.abs(point.withdrawals), 0),
      })
    }
    if (timestamp.unix() >= thresholdHistorical30d) {
      chartBaseData['30d'].push({
        timestamp: timestamp.unix(),
        timestampParsed,
        netValue: point.netValue,
        depositedValue: Math.max(point.deposits - Math.abs(point.withdrawals), 0),
      })
    }
  })

  // history daily points
  positionHistory.position?.dailyPositionHistory.reverse().forEach((point) => {
    const timestamp = dayjs(point.timestamp * 1000).startOf('day')
    const timestampParsed = timestamp.format(CHART_TIMESTAMP_FORMAT)

    if (timestamp.unix() >= thresholdHistorical90d) {
      chartBaseData['90d'].push({
        timestamp: timestamp.unix(),
        timestampParsed,
        netValue: point.netValue,
        depositedValue: Math.max(point.deposits - Math.abs(point.withdrawals), 0),
      })
    }
    if (timestamp.unix() >= thresholdHistorical6m) {
      chartBaseData['6m'].push({
        timestamp: timestamp.unix(),
        timestampParsed,
        netValue: point.netValue,
        depositedValue: Math.max(point.deposits - Math.abs(point.withdrawals), 0),
      })
    }
    if (timestamp.unix() >= thresholdHistorical1y) {
      chartBaseData['1y'].push({
        timestamp: timestamp.unix(),
        timestampParsed,
        netValue: point.netValue,
        depositedValue: Math.max(point.deposits - Math.abs(point.withdrawals), 0),
      })
    }
  })

  // history weekly points
  positionHistory.position?.weeklyPositionHistory.reverse().forEach((point) => {
    const timestamp = dayjs(point.timestamp * 1000).startOf('week')
    const timestampParsed = timestamp.format(CHART_TIMESTAMP_FORMAT)

    if (timestamp.unix() >= thresholdHistorical3y) {
      chartBaseData['3y'].push({
        timestamp: timestamp.unix(),
        timestampParsed,
        netValue: point.netValue,
        depositedValue: Math.max(point.deposits - Math.abs(point.withdrawals), 0),
      })
    }
  })

  // history and forecast meeting point
  // TBD

  // forecast hourly points
  positionForecast.dataPoints.hourly
    .slice(0, forecastCutoff.hourly)
    .forEach((point, pointIndex) => {
      const timestamp = dayjs(point.timestamp, 'YYYY-MM-DD HH:mm:ss').startOf('hour')
      const timestampParsed = timestamp.format(CHART_TIMESTAMP_FORMAT)

      if (pointIndex === 0) {
        // first point in the forecast must be merged with
        // the last point in the history
        const last7dPoint = chartBaseData['7d'][chartBaseData['7d'].length - 1]
        const last30dPoint = chartBaseData['30d'][chartBaseData['30d'].length - 1]

        chartBaseData['7d'][chartBaseData['7d'].length - 1] = {
          ...last7dPoint,
          forecast: point.forecast,
          bounds: point.bounds,
        }
        chartBaseData['30d'][chartBaseData['30d'].length - 1] = {
          ...last30dPoint,
          forecast: point.forecast,
          bounds: point.bounds,
        }

        return
      }

      if (timestamp.unix() <= thresholdForecast7d) {
        chartBaseData['7d'].push({
          timestamp: timestamp.unix(),
          timestampParsed,
          forecast: point.forecast,
          bounds: point.bounds,
        })
      }
      if (timestamp.unix() <= thresholdForecast30d) {
        chartBaseData['30d'].push({
          timestamp: timestamp.unix(),
          timestampParsed,
          forecast: point.forecast,
          bounds: point.bounds,
        })
      }
    })

  // forecast daily points
  positionForecast.dataPoints.daily.slice(0, forecastCutoff.daily).forEach((point, pointIndex) => {
    const timestamp = dayjs(point.timestamp, 'YYYY-MM-DD HH:mm:ss').startOf('day')
    const timestampParsed = timestamp.format(CHART_TIMESTAMP_FORMAT)

    if (pointIndex === 0) {
      // first point in the forecast must be merged with
      // the last point in the history
      const last90dPoint = chartBaseData['90d'][chartBaseData['90d'].length - 1]
      const last6mPoint = chartBaseData['6m'][chartBaseData['6m'].length - 1]
      const last1yPoint = chartBaseData['1y'][chartBaseData['1y'].length - 1]

      chartBaseData['90d'][chartBaseData['90d'].length - 1] = {
        ...last90dPoint,
        forecast: point.forecast,
        bounds: point.bounds,
      }
      chartBaseData['6m'][chartBaseData['6m'].length - 1] = {
        ...last6mPoint,
        forecast: point.forecast,
        bounds: point.bounds,
      }
      chartBaseData['1y'][chartBaseData['1y'].length - 1] = {
        ...last1yPoint,
        forecast: point.forecast,
        bounds: point.bounds,
      }

      return
    }
    if (timestamp.unix() <= thresholdForecast90d) {
      chartBaseData['90d'].push({
        timestamp: timestamp.unix(),
        timestampParsed,
        forecast: point.forecast,
        bounds: point.bounds,
      })
    }
    if (timestamp.unix() <= thresholdForecast6m) {
      chartBaseData['6m'].push({
        timestamp: timestamp.unix(),
        timestampParsed,
        forecast: point.forecast,
        bounds: point.bounds,
      })
    }
    if (timestamp.unix() <= thresholdForecast1y) {
      chartBaseData['1y'].push({
        timestamp: timestamp.unix(),
        timestampParsed,
        forecast: point.forecast,
        bounds: point.bounds,
      })
    }
  })

  // forecast weekly points
  positionForecast.dataPoints.weekly
    .slice(0, forecastCutoff.weekly)
    .forEach((point, pointIndex) => {
      const timestamp = dayjs(point.timestamp, 'YYYY-MM-DD HH:mm:ss').startOf('week')
      const timestampParsed = timestamp.format(CHART_TIMESTAMP_FORMAT)

      if (pointIndex === 0) {
        // first point in the forecast must be merged with
        // the last point in the history
        const last3yPoint = chartBaseData['3y'][chartBaseData['3y'].length - 1]

        chartBaseData['3y'][chartBaseData['3y'].length - 1] = {
          ...last3yPoint,
          forecast: point.forecast,
          bounds: point.bounds,
        }

        return
      }

      if (timestamp.unix() <= thresholdForecast3y) {
        chartBaseData['3y'].push({
          timestamp: timestamp.unix(),
          timestampParsed,
          forecast: point.forecast,
          bounds: point.bounds,
        })
      }
    })

  return {
    data: chartBaseData,
  }
}

export const decorateWithPerformanceChartData = (
  vaults: SDKVaultishType[],
  vaultData: {
    positionHistory: GetPositionHistoryReturnType
    positionForecast: ForecastData
  },
) => {
  const { positionHistory, positionForecast } = vaultData

  return vaults.map((vault) => ({
    ...vault,
    customFields: {
      ...vault.customFields,
      performanceChartData: mergePositionHistoryAndForecast(positionHistory, positionForecast),
    },
  }))
}
