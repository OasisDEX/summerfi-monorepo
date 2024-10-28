import { type InlineButtonOption } from '@summerfi/app-types'

import type { IndividualYieldsRawData } from '@/features/vault-details/components/VaultDetailsAdvancedYield/mapper'

// dummy data for now
export const yieldsRawData: IndividualYieldsRawData[] = [
  {
    vault: 'Summer.fi USDC Strategy',
    currentApy: '0.32',
    avgApyPer30d: '0.103',
    avgApyPer1y: '0.093',
    allTimeMedianApy: '0.0643',
    yieldLowHigh: {
      low: '0.0643',
      high: '0.1355',
    },
  },
  {
    vault: 'Pendle USDC0++',
    currentApy: '0.32',
    avgApyPer30d: '0.103',
    avgApyPer1y: '0.093',
    allTimeMedianApy: '0.0643',
    yieldLowHigh: {
      low: '0.0643',
      high: '0.1355',
    },
  },
  {
    vault: 'AAVE v3 USDC',
    currentApy: '0.32',
    avgApyPer30d: '0.103',
    avgApyPer1y: '0.093',
    allTimeMedianApy: '0.0643',
    yieldLowHigh: {
      low: '0.0643',
      high: '0.1355',
    },
  },
  {
    vault: 'MetaMorpho Gauntlet MKR Blended',
    currentApy: '0.32',
    avgApyPer30d: '0.103',
    avgApyPer1y: '0.093',
    allTimeMedianApy: '0.0643',
    yieldLowHigh: {
      low: '0.0643',
      high: '0.1355',
    },
  },
  {
    vault: 'All Defi Median',
    currentApy: '0.32',
    avgApyPer30d: '0.103',
    avgApyPer1y: '0.093',
    allTimeMedianApy: '0.0643',
    yieldLowHigh: {
      low: '0.0643',
      high: '0.1355',
    },
  },
]

export const historicalYieldOptions: InlineButtonOption<string>[] = [
  {
    title: 'All',
    key: 'all',
  },
  {
    title: 'Summer.fi',
    key: 'summerfi',
  },
  {
    title: 'Pendle',
    key: 'pendle',
  },
  {
    title: 'AAVE v3',
    key: 'aavev3',
  },
  {
    title: 'MetaMorpho',
    key: 'metamorpho',
  },
  {
    title: 'Uni V3',
    key: 'univ3',
  },
  {
    title: 'DeFi Median',
    key: 'defimedian',
  },
  {
    title: 'Strategy A',
    key: 'strategya',
  },
  {
    title: 'Strategy B',
    key: 'strategyb',
  },
  {
    title: 'Strategy C',
    key: 'strategyc',
  },
  {
    title: 'Strategy D',
    key: 'strategyd',
  },
  {
    title: 'Strategy E',
    key: 'strategye',
  },
]

enum StrategyExposureFilterType {
  ALL = 'ALL',
  ALLOCATED = 'ALLOCATED',
  UNALLOCATED = 'UNALLOCATED',
}

export const individualYieldOptions = [
  {
    title: 'All',
    key: StrategyExposureFilterType.ALL,
  },
  {
    title: 'Allocated',
    key: StrategyExposureFilterType.ALLOCATED,
  },
  {
    title: 'Unallocated',
    key: StrategyExposureFilterType.UNALLOCATED,
  },
]
