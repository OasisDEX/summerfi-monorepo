import { Card, DataBlock, SimpleGrid, StrategyCard, StrategyGrid } from '@summerfi/app-earn-ui'
import { type Risk, type TokenSymbolsList } from '@summerfi/app-types'

import FormContainer from '@/components/organisms/Form/FormContainer'
import {
  RebalancingActivity,
  type RebalancingActivityRawData,
} from '@/components/organisms/RebalancingActivity/RebalancingActivity'
import type { FleetConfig } from '@/helpers/sdk/types'

type EarnStrategyPageProps = {
  params: {
    strategy: string
  }
}

const fleetConfig: FleetConfig = {
  tokenSymbol: 'USDC',
  fleetAddress: '0x75d4f7cb1b2481385e0878c639f6f6d66592d399',
}

const rebalancingActivityData: RebalancingActivityRawData[] = [
  {
    type: 'reduce',
    action: {
      from: 'USDC',
      to: 'DAI',
    },
    amount: {
      token: 'USDC',
      value: '123123',
    },
    timestamp: '12321321',
    provider: {
      link: '/',
      label: 'Summer.fi',
    },
  },
  {
    type: 'increase',
    action: {
      from: 'USDT',
      to: 'USDC',
    },
    amount: {
      token: 'USDT',
      value: '123123',
    },
    timestamp: '12321321',
    provider: {
      link: '/',
      label: 'Summer.fi',
    },
  },
]

const EarnStrategyPage = ({ params }: EarnStrategyPageProps) => {
  const [_id, token, _network, _apy, risk] = params.strategy.split('-')

  return (
    <StrategyGrid
      topContent={
        <SimpleGrid columns={3} style={{ justifyItems: 'stretch' }} gap={170}>
          <DataBlock
            title="Total Assets"
            titleTooltip="Tooltip about assets or something"
            size="large"
            value="$800,130,321"
          />
          <DataBlock
            title="Total Assets"
            titleTooltip="Tooltip about assets or something"
            size="large"
            value="14.3b"
          />
          <DataBlock
            title="Total Assets"
            titleTooltip="Tooltip about assets or something"
            size="large"
            value="6"
          />
        </SimpleGrid>
      }
      leftContent={
        <>
          <StrategyCard
            secondary
            bestFor=""
            risk={risk as Risk}
            symbol={token as TokenSymbolsList}
            totalAssets="0"
          />
          <RebalancingActivity rawData={rebalancingActivityData} />
        </>
      }
      rightContent={<FormContainer fleetConfig={fleetConfig} />}
    />
  )
}

export default EarnStrategyPage
