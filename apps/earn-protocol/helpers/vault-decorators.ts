import {
  type ChartsDataTimeframes,
  type EarnAppConfigType,
  type SDKVaultishType,
  type SDKVaultType,
  type TimeframesType,
  type VaultChartsHistoricalData,
} from '@summerfi/app-types'
import { subgraphNetworkToId } from '@summerfi/app-utils'
import dayjs from 'dayjs'
import { memoize } from 'lodash-es'

import { type GetInterestRatesReturnType } from '@/app/server-handlers/interest-rates'
import { CHART_TIMESTAMP_FORMAT } from '@/constants/charts'
import { getProtocolLabel } from '@/helpers/get-protocol-label'

const historicalChartprotocolsColorMap = {
  DEFAULT: '#cccccc',
  AaveV3: '#8A2D6E',
  CompoundV3: '#00A37A',
  Fluid: '#005BB5',
  Morpho: '#CC5A55',
  Gearbox: '#c37227',
  'Compound V3': '#4CAF50',
  'Aave V3': '#FF5722',
  'Morpho Gauntlet USDC Core': '#3F51B5',
  'Morpho Re7 USDC': '#FFC107',
  'Morpho Gauntlet USDC Prime': '#9C27B0',
  'Morpho Steakhouse USDC': '#FF9800',
}

type BaseHistoricalChartsDataReturnType = {
  [key in TimeframesType]: {
    [key: string]: { [key: string]: number | string; timestamp: string }
  }
}

export const decorateWithFleetConfig = (
  vaults: SDKVaultishType[],
  fleetMap: EarnAppConfigType['fleetMap'],
) =>
  vaults.map((vault) => {
    const vaultNetworkId = subgraphNetworkToId(vault.protocol.network)
    const vaultNetworkConfig = fleetMap[String(vaultNetworkId) as keyof typeof fleetMap]
    const configCustomFields = vaultNetworkConfig[vault.id.toLowerCase() as '0x']

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return configCustomFields
      ? {
          ...vault,
          customFields: {
            ...vault.customFields,
            ...configCustomFields,
          },
        }
      : vault
  })

const emptyChartRaw = {
  '7d': {},
  '30d': {},
  '90d': {},
  '6m': {},
  '1y': {},
  '3y': {},
}

const emptyChart = {
  '7d': [{ timestamp: 0 }],
  '30d': [{ timestamp: 0 }],
  '90d': [{ timestamp: 0 }],
  '6m': [{ timestamp: 0 }],
  '1y': [{ timestamp: 0 }],
  '3y': [{ timestamp: 0 }],
}

const getBaseHistoricalChartsData = memoize(
  (fillTimeframe = true): BaseHistoricalChartsDataReturnType => {
    const today = dayjs()
    // establish a base values for the chart data
    // each chart data points has a timestamp key and an empty object as value
    // which will be filled with the interest rate data

    if (!fillTimeframe) {
      // if we dont want to show the whole timeframe (ex 1y worth of points with only available data)
      // just set this to false
      return emptyChartRaw
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
      '7d': createDataArray(7 * 24, 'hour'),
      '30d': createDataArray(30 * 24, 'hour'),
      '90d': createDataArray(90, 'day'),
      '6m': createDataArray(30 * 6, 'day'),
      '1y': createDataArray(365, 'day'),
      '3y': createDataArray(52 * 3, 'week'),
    }
  },
)

export const decorateWithHistoricalChartsData = (
  vaults: SDKVaultishType[],
  arkInterestRatesMap: GetInterestRatesReturnType,
) => {
  // I am mapping through a list of vaults, but in this
  // case (arkInterestRatesMap present) it should be just one vault
  // EDIT: Unless its portfolio...

  return vaults.map(
    memoize((vault) => {
      const castedVault = vault as SDKVaultType
      const vaultName = castedVault.customFields?.name ?? 'Summer Vault'
      const today = dayjs()
      const threshold7d = today.startOf('hour').subtract(7, 'day').unix()
      const threshold30d = today.startOf('hour').subtract(30, 'day').unix()
      const threshold90d = today.startOf('day').subtract(90, 'day').unix()
      const threshold6m = today.startOf('day').subtract(6, 'month').unix()
      const threshold1y = today.startOf('day').subtract(1, 'year').unix()
      const threshold3y = today.startOf('week').subtract(3, 'year').unix()

      const chartDataNames = [] // a list of names needed for the chart (vault + arks)
      // base data structure for the charts, filled with empty objects
      // created with displaying whole timeframe in mind, now we're displaying only the timeframe
      // that has vault data available, but that might change (in that case just remove the false param)
      const chartsDataRaw = getBaseHistoricalChartsData(false)
      const arksInterestRatesKeys = Object.keys(arkInterestRatesMap) as string[]

      // mapping the interest rates for the vault itself
      for (const vaultHourlyInterestRate of castedVault.hourlyInterestRates) {
        const timestamp = dayjs(Number(vaultHourlyInterestRate.date) * 1000).startOf('hour')
        const timestampFormatted = timestamp.format(CHART_TIMESTAMP_FORMAT)

        const averageRate = Number(vaultHourlyInterestRate.averageRate)
        const timestampAndData = { timestamp: timestampFormatted, [vaultName]: averageRate }

        if (timestamp.unix() > threshold7d) {
          if (!(timestampFormatted in chartsDataRaw['7d'])) {
            chartsDataRaw['7d'][timestampFormatted] = timestampAndData
          } else {
            chartsDataRaw['7d'][timestampFormatted][vaultName] = averageRate
          }
        }

        if (timestamp.unix() > threshold30d) {
          if (!(timestampFormatted in chartsDataRaw['30d'])) {
            chartsDataRaw['30d'][timestampFormatted] = timestampAndData
          } else {
            chartsDataRaw['30d'][timestampFormatted][vaultName] = averageRate
          }
        }
      }
      for (const vaultDailyInterestRate of castedVault.dailyInterestRates) {
        const timestamp = dayjs(Number(vaultDailyInterestRate.date) * 1000).startOf('day')
        const timestampFormatted = timestamp.format(CHART_TIMESTAMP_FORMAT)

        chartsDataRaw['90d'][timestampFormatted] = { timestamp: timestampFormatted }
        chartsDataRaw['6m'][timestampFormatted] = { timestamp: timestampFormatted }
        chartsDataRaw['1y'][timestampFormatted] = { timestamp: timestampFormatted }

        if (timestamp.unix() > threshold90d) {
          chartsDataRaw['90d'][timestampFormatted] = {
            ...chartsDataRaw['90d'][timestampFormatted],
            [vaultName]: Number(vaultDailyInterestRate.averageRate),
          }
        }

        if (timestamp.unix() > threshold6m) {
          chartsDataRaw['6m'][timestampFormatted] = {
            ...chartsDataRaw['6m'][timestampFormatted],
            [vaultName]: Number(vaultDailyInterestRate.averageRate),
          }
        }
        if (timestamp.unix() > threshold1y) {
          chartsDataRaw['1y'][timestampFormatted] = {
            ...chartsDataRaw['1y'][timestampFormatted],
            [vaultName]: Number(vaultDailyInterestRate.averageRate),
          }
        }
      }
      for (const vaultWeeklyInterestRate of castedVault.weeklyInterestRates) {
        const timestamp = dayjs(Number(vaultWeeklyInterestRate.date) * 1000).startOf('week')
        const timestampFormatted = timestamp.format(CHART_TIMESTAMP_FORMAT)

        chartsDataRaw['3y'][timestampFormatted] = { timestamp: timestampFormatted }

        if (timestamp.unix() > threshold3y) {
          chartsDataRaw['3y'][timestampFormatted] = {
            ...chartsDataRaw['3y'][timestampFormatted],
            [vaultName]: Number(vaultWeeklyInterestRate.averageRate),
          }
        }
      }

      // mapping the interest rates for all arks (but only since the vault has APR)
      // no need to check for the threshold, since we map ark interest rates only against the vaults data
      for (const arkInterestRateKey of arksInterestRatesKeys) {
        const interestRates = arkInterestRatesMap[arkInterestRateKey]

        // temporary mapping, we need something more robust from subgraph
        const protocol = arkInterestRateKey.split('-')

        const arkUniqueName = getProtocolLabel(protocol)

        chartDataNames.push(arkUniqueName)

        for (const hourlyInterestRate of interestRates.hourlyInterestRates) {
          const timestamp = dayjs(hourlyInterestRate.date * 1000)
            .startOf('hour')
            .format(CHART_TIMESTAMP_FORMAT)

          if (timestamp in chartsDataRaw['7d']) {
            chartsDataRaw['7d'][timestamp] = {
              ...chartsDataRaw['7d'][timestamp],
              [arkUniqueName]: Number(hourlyInterestRate.averageRate),
            }
          }
          if (timestamp in chartsDataRaw['30d']) {
            chartsDataRaw['30d'][timestamp] = {
              ...chartsDataRaw['30d'][timestamp],
              [arkUniqueName]: Number(hourlyInterestRate.averageRate),
            }
          }
        }

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
        emptyChart,
      )

      const chartColors = Object.keys(arkInterestRatesMap).reduce((acc, key) => {
        // temporary mapping, we need something more robust from subgraph
        const protocol = key.split('-')
        const arkUniqueName = getProtocolLabel(protocol)

        return {
          ...acc,
          [arkUniqueName]:
            arkUniqueName in historicalChartprotocolsColorMap
              ? historicalChartprotocolsColorMap[
                  arkUniqueName as keyof typeof historicalChartprotocolsColorMap
                ]
              : historicalChartprotocolsColorMap.DEFAULT,
        }
      }, {})

      const chartsData: VaultChartsHistoricalData['chartsData'] = {
        data: chartDataPoints,
        dataNames: chartDataNames,
        colors: chartColors,
      }

      return {
        ...vault,
        customFields: {
          ...vault.customFields,
          chartsData,
        },
      }
    }),
  ) as SDKVaultishType[]
}

export const decorateWithArkInterestRatesData = (
  vaults: SDKVaultishType[],
  arkInterestRatesMap: GetInterestRatesReturnType,
) => {
  return vaults.map((vault) => ({
    ...vault,
    customFields: {
      ...vault.customFields,
      arksInterestRates: Object.fromEntries(
        Object.keys(arkInterestRatesMap).map((key) => [
          key,
          arkInterestRatesMap[key].latestInterestRate[0].rate[0].rate,
        ]),
      ),
    },
  }))
}
