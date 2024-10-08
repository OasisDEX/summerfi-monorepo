import { Expander, StrategyGridDetails, Text } from '@summerfi/app-earn-ui'

import FormContainer from '@/components/organisms/Form/FormContainer'
import {
  RebalancingActivity,
  type RebalancingActivityRawData,
} from '@/components/organisms/RebalancingActivity/RebalancingActivity'
import { type strategiesList } from '@/constants/dev-strategies-list'
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
  const [id, symbol, network, apy, risk] = params.strategy.split('-')

  return (
    <StrategyGridDetails
      strategy={
        {
          id,
          symbol,
          network,
          apy,
          risk,
        } as (typeof strategiesList)[number]
      }
      leftContent={
        <Expander
          title={
            <Text as="p" variant="p1semi">
              Rebalancing activity
            </Text>
          }
          defaultExpanded
        >
          <RebalancingActivity rawData={rebalancingActivityData} />
        </Expander>
      }
      rightContent={<FormContainer fleetConfig={fleetConfig} />}
    />
  )
}

export default EarnStrategyPage
