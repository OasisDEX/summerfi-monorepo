import {
  type ChartsDataTimeframes,
  type SDKVaultishType,
  type SDKVaultType,
  type VaultChartsHistoricalData,
} from '@summerfi/app-types'
import dayjs from 'dayjs'
import { memoize } from 'lodash-es'

import { type GetInterestRatesReturnType } from '@/app/server-handlers/interest-rates'
import { CHART_TIMESTAMP_FORMAT } from '@/constants/charts'

const historicalChartprotocolsColorMap = {
  DEFAULT: '#cccccc',
  AaveV3: '#8A2D6E',
  CompoundV3: '#00A37A',
  Fluid: '#005BB5',
  Morpho: '#CC5A55',
  Gearbox: '#c37227',
}

const getBaseHistoricalChartsData = memoize((fillTimeframe = true) => {
  const today = dayjs()
  // establish a base values for the chart data
  // each chart data points has a timestamp key and an empty object as value
  // which will be filled with the interest rate data

  if (!fillTimeframe) {
    // if we dont want to show the whole timeframe (ex 1y worth of points with only available data)
    // just set this to false
    return {
      '90d': {},
      '6m': {},
      '1y': {},
      '3y': {},
    }
  }

  const createDataArray = (arrLength: number, unit: dayjs.ManipulateType) =>
    Array.from({ length: arrLength }).reduce<{
      [key: string]: { [key: string]: number | string; timestamp: string }
    }>((acc, _, i) => {
      const timestamp = today.startOf(unit).subtract(i, unit).format(CHART_TIMESTAMP_FORMAT)

      acc[timestamp] = { timestamp }

      return acc
    }, {})

  return {
    '90d': createDataArray(90, 'day'),
    '6m': createDataArray(30 * 6, 'day'),
    '1y': createDataArray(365, 'day'),
    '3y': createDataArray(52 * 3, 'week'),
  }
})

export const decorateWithHistoricalChartsData = (
  vaults: SDKVaultishType[],
  arkInterestRatesMap: GetInterestRatesReturnType,
) => {
  // I am mapping through a list of vaults, but in this case (arkInterestRatesMap present)
  // it should be just one vault
  return vaults.map(
    memoize((vault) => {
      const castedVault = vault as SDKVaultType
      const vaultName = castedVault.customFields?.name ?? 'Summer Vault'

      // eslint-disable-next-line no-console
      console.time(`decorateWithHistoricalChartsData ${vaultName}`)
      const chartDataNames = []
      const chartsDataRaw = getBaseHistoricalChartsData(false)
      const arksInterestRatesKeys = Object.keys(arkInterestRatesMap) as string[]

      // mapping the interest rates for the vault itself
      for (const vaultDailyInterestRate of castedVault.dailyApr) {
        const timestamp = dayjs(Number(vaultDailyInterestRate.date) * 1000)
          .startOf('day')
          .format(CHART_TIMESTAMP_FORMAT)

        chartsDataRaw['90d'][timestamp] = { timestamp }
        chartsDataRaw['6m'][timestamp] = { timestamp }
        chartsDataRaw['1y'][timestamp] = { timestamp }
        chartsDataRaw['90d'][timestamp] = {
          ...chartsDataRaw['90d'][timestamp],
          [vaultName]: Number(vaultDailyInterestRate.apr),
        }
        chartsDataRaw['6m'][timestamp] = {
          ...chartsDataRaw['6m'][timestamp],
          [vaultName]: Number(vaultDailyInterestRate.apr),
        }
        chartsDataRaw['1y'][timestamp] = {
          ...chartsDataRaw['1y'][timestamp],
          [vaultName]: Number(vaultDailyInterestRate.apr),
        }
      }

      // mapping the interest rates for all arks (but only since the vault has APR)
      for (const arkInterestRateKey of arksInterestRatesKeys) {
        const interestRates = arkInterestRatesMap[arkInterestRateKey]
        const arkUniqueName = `${arkInterestRateKey.split('-')[0]}-${arkInterestRateKey.split('-')[2].slice(0, 5)}`

        chartDataNames.push(arkUniqueName)

        for (const dailyInterestRate of interestRates.dailyInterestRates) {
          const timestamp = dayjs(dailyInterestRate.date * 1000)
            .startOf('day')
            .format(CHART_TIMESTAMP_FORMAT)

          if (timestamp in chartsDataRaw['90d']) {
            chartsDataRaw['90d'][timestamp] = {
              ...chartsDataRaw['90d'][timestamp],
              [arkUniqueName]: Number(dailyInterestRate.averageRate),
            }
          }
          if (timestamp in chartsDataRaw['6m']) {
            chartsDataRaw['6m'][timestamp] = {
              ...chartsDataRaw['6m'][timestamp],
              [arkUniqueName]: Number(dailyInterestRate.averageRate),
            }
          }
          if (timestamp in chartsDataRaw['1y']) {
            chartsDataRaw['1y'][timestamp] = {
              ...chartsDataRaw['1y'][timestamp],
              [arkUniqueName]: Number(dailyInterestRate.averageRate),
            }
          }
        }
        for (const weeklyInterestRate of interestRates.weeklyInterestRates) {
          const timestamp = dayjs(weeklyInterestRate.date * 1000)
            .startOf('week')
            .format(CHART_TIMESTAMP_FORMAT) as keyof (typeof chartsDataRaw)['90d']

          if (timestamp in chartsDataRaw['3y']) {
            chartsDataRaw['3y'][timestamp] = {
              ...chartsDataRaw['3y'][timestamp],
              [arkUniqueName]: Number(weeklyInterestRate.averageRate),
            }
          }
        }
      }
      const chartDataPoints = Object.keys(chartsDataRaw).reduce<ChartsDataTimeframes>(
        (acc, key) => {
          const data = Object.values(chartsDataRaw[key as keyof typeof chartsDataRaw])

          return {
            ...acc,
            [key]: data.sort((a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix()), // final sorting
          } as ChartsDataTimeframes
        },
        {
          '90d': [{ timestamp: 0 }],
          '6m': [{ timestamp: 0 }],
          '1y': [{ timestamp: 0 }],
          '3y': [{ timestamp: 0 }],
        },
      )

      const chartColors = Object.keys(arkInterestRatesMap).reduce((acc, key) => {
        const protocolKey = key.split('-')[0] as keyof typeof historicalChartprotocolsColorMap
        const arkUniqueName = `${key.split('-')[0]}-${key.split('-')[2].slice(0, 5)}`

        return {
          ...acc,
          [arkUniqueName]:
            protocolKey in historicalChartprotocolsColorMap
              ? historicalChartprotocolsColorMap[protocolKey]
              : historicalChartprotocolsColorMap.DEFAULT,
        }
      }, {})

      const chartsData: VaultChartsHistoricalData['chartsData'] = {
        data: chartDataPoints,
        dataNames: chartDataNames,
        colors: chartColors,
      }

      // eslint-disable-next-line no-console
      console.timeEnd(`decorateWithHistoricalChartsData ${vault.customFields?.name}`)

      return {
        ...vault,
        customFields: {
          ...vault.customFields,
          chartsData,
        },
      }
    }),
  )
}
