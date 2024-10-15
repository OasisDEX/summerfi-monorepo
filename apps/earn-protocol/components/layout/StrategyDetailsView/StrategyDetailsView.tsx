'use client'

import { StrategyDetailsFaq } from '@/components/organisms/StrategyDetailsFaq/StrategyDetailsFaq'
import { StrategyDetailsHowItWorks } from '@/components/organisms/StrategyDetailsHowItWorks/StrategyDetailsHowItWorks'
import { StrategyDetailsSecurity } from '@/components/organisms/StrategyDetailsSecurity/StrategyDetailsSecurity'
import { type IndividualYieldsRawData } from '@/components/organisms/StrategyDetailsYields/mapper'
import { StrategyDetailsYields } from '@/components/organisms/StrategyDetailsYields/StrategyDetailsYields'

const yieldsRawData: IndividualYieldsRawData[] = [
  {
    strategy: 'Summer.fi USDC Strategy',
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
    strategy: 'Pendle USDC0++',
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
    strategy: 'AAVE v3 USDC',
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
    strategy: 'MetaMorpho Gauntlet MKR Blended',
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
    strategy: 'All Defi Median',
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

export const StrategyDetailsView = () => {
  return (
    <>
      <StrategyDetailsHowItWorks />
      <StrategyDetailsYields rawData={yieldsRawData} />
      <StrategyDetailsSecurity />
      <StrategyDetailsFaq />
    </>
  )
}
