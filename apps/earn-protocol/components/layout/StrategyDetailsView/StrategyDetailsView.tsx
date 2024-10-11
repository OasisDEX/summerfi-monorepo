'use client'
import { Card } from '@summerfi/app-earn-ui'

import { StrategyDetailsHowItWorks } from '@/components/organisms/StrategyDetailsHowItWorks/StrategyDetailsHowItWorks'
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
      <div id="yield-sources">
        <Card variant="cardPrimary">
          <div style={{ margin: '500px' }}>Yield Sources</div>
        </Card>
      </div>
      <div id="security">
        <Card variant="cardPrimary">
          <div style={{ margin: '500px' }}>Security</div>
        </Card>
      </div>
      <div id="faq">
        <Card variant="cardPrimary">
          <div style={{ margin: '500px' }}>Faq</div>
        </Card>
      </div>
    </>
  )
}
