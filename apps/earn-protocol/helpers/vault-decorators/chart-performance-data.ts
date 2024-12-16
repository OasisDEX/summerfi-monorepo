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
  const today = dayjs()
  const threshold7d = today.startOf('hour').subtract(7, 'day').unix()
  const threshold30d = today.startOf('hour').subtract(30, 'day').unix()
  const threshold90d = today.startOf('day').subtract(90, 'day').unix()
  const threshold6m = today.startOf('day').subtract(6, 'month').unix()
  const threshold1y = today.startOf('day').subtract(1, 'year').unix()
  const threshold3y = today.startOf('week').subtract(3, 'year').unix()
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

    if (timestamp.unix() > threshold7d) {
      chartBaseData['7d'].push({
        timestamp: timestamp.unix(),
        timestampParsed,
        netValue: point.netValue,
        depositedValue: Math.max(point.deposits - Math.abs(point.withdrawals), 0),
      })
    }
    if (timestamp.unix() > threshold30d) {
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

    if (timestamp.unix() > threshold90d) {
      chartBaseData['90d'].push({
        timestamp: timestamp.unix(),
        timestampParsed,
        netValue: point.netValue,
        depositedValue: Math.max(point.deposits - Math.abs(point.withdrawals), 0),
      })
    }
    if (timestamp.unix() > threshold6m) {
      chartBaseData['6m'].push({
        timestamp: timestamp.unix(),
        timestampParsed,
        netValue: point.netValue,
        depositedValue: Math.max(point.deposits - Math.abs(point.withdrawals), 0),
      })
    }
    if (timestamp.unix() > threshold1y) {
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

    if (timestamp.unix() > threshold3y) {
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

      chartBaseData['7d'].push({
        timestamp: timestamp.unix(),
        timestampParsed,
        forecast: point.forecast,
        bounds: point.bounds,
      })
      chartBaseData['30d'].push({
        timestamp: timestamp.unix(),
        timestampParsed,
        forecast: point.forecast,
        bounds: point.bounds,
      })
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

    chartBaseData['90d'].push({
      timestamp: timestamp.unix(),
      timestampParsed,
      forecast: point.forecast,
      bounds: point.bounds,
    })
    chartBaseData['6m'].push({
      timestamp: timestamp.unix(),
      timestampParsed,
      forecast: point.forecast,
      bounds: point.bounds,
    })
    chartBaseData['1y'].push({
      timestamp: timestamp.unix(),
      timestampParsed,
      forecast: point.forecast,
      bounds: point.bounds,
    })
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

      chartBaseData['3y'].push({
        timestamp: timestamp.unix(),
        timestampParsed,
        forecast: point.forecast,
        bounds: point.bounds,
      })
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
