'use client'

import { useMemo } from 'react'
import { Expander, StrategyGridPreview, Text, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { MockedLineChart } from '@/components/organisms/Charts/MockedLineChart'
import FormContainer from '@/components/organisms/Form/FormContainer'
import {
  RebalancingActivity,
  type RebalancingActivityRawData,
} from '@/components/organisms/RebalancingActivity/RebalancingActivity'
import {
  StrategyExposure,
  type StrategyExposureRawData,
} from '@/components/organisms/StrategyExposure/StrategyExposure'
import {
  UserActivity,
  type UserActivityRawData,
} from '@/components/organisms/UserActivity/UserActivity'
import { strategiesList } from '@/constants/dev-strategies-list'
import type { FleetConfig } from '@/helpers/sdk/types'

type EarnStrategyPreviewPageProps = {
  params: {
    strategy_id: string
  }
}

const fleetConfig: FleetConfig = {
  tokenSymbol: 'USDC',
  fleetAddress: '0x75d4f7cb1b2481385e0878c639f6f6d66592d399',
}

const strategyExposureRawData: StrategyExposureRawData[] = [
  {
    strategy: {
      label: 'MKR Blended',
      primaryToken: 'USDC',
      secondaryToken: 'DAI',
    },
    allocation: '0.32',
    currentApy: '0.103',
    liquidity: '43000000',
    type: 'Fixed yield',
  },
  {
    strategy: {
      label: 'MKR Blended',
      primaryToken: 'USDC',
      secondaryToken: 'DAI',
    },
    allocation: '0.32',
    currentApy: '0.103',
    liquidity: '43000000',
    type: 'Isolated landing',
  },
  {
    strategy: {
      label: 'MKR Blended',
      primaryToken: 'USDC',
      secondaryToken: 'DAI',
    },
    allocation: '0.32',
    currentApy: '0.103',
    liquidity: '43000000',
    type: 'Lending',
  },
  {
    strategy: {
      label: 'MKR Blended',
      primaryToken: 'USDC',
      secondaryToken: 'DAI',
    },
    allocation: '0.32',
    currentApy: '0.103',
    liquidity: '43000000',
    type: 'Basic Trading',
  },
]

const rebalancingActivityRawData: RebalancingActivityRawData[] = [
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
    timestamp: '1727385013506',
    provider: {
      link: '/',
      label: 'Summer.fi',
    },
  },
]

const userActivityRawData: UserActivityRawData[] = [
  {
    balance: '120000',
    amount: '123123',
    numberOfDeposits: '13',
    time: '1727385013506',
    earningStreak: {
      link: '/',
      label: 'View',
    },
  },
  {
    balance: '1420000',
    amount: '321321',
    numberOfDeposits: '9',
    time: '1727585013506',
    earningStreak: {
      link: '/',
      label: 'View',
    },
  },
]

const detailsLinks = [
  {
    label: 'How it all works',
    id: 'how-it-works',
  },
  {
    label: 'Advanced yield data',
    id: 'advanced-yield-data',
  },
  {
    label: 'Yield sources',
    id: 'yield-sources',
  },
  {
    label: 'Security',
    id: 'security',
  },
  {
    label: 'FAQ',
    id: 'faq',
  },
]

const EarnStrategyPreviewPage = ({ params }: EarnStrategyPreviewPageProps) => {
  // open/manage view (not connected)
  const selectedStrategyData = useMemo(() => {
    return strategiesList.find((strategy) => strategy.id === params.strategy_id)
  }, [params])

  return (
    <StrategyGridPreview
      strategy={selectedStrategyData as (typeof strategiesList)[number]}
      strategies={strategiesList}
      leftContent={
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-space-x-large)',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-space-medium)',
            }}
          >
            <Text variant="h5">About the strategy</Text>
            <Text
              variant="p2"
              style={{
                color: 'var(--color-text-secondary)',
              }}
            >
              The Summer Earn Protocol is a permissionless passive lending product, which sets out
              to offer effortless and secure optimised yield, while diversifying risk.
            </Text>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              {detailsLinks.map(({ label, id }) => (
                <Link
                  key={label}
                  href={`/earn/${selectedStrategyData?.network}/details/${selectedStrategyData?.id}#${id}`}
                >
                  <Text
                    as="p"
                    variant="p3semi"
                    style={{
                      color: 'var(--color-text-link)',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      paddingRight: 'var(--spacing-space-medium)',
                    }}
                  >
                    <WithArrow>{label}</WithArrow>
                  </Text>
                </Link>
              ))}
            </div>
          </div>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Historical yield
              </Text>
            }
            defaultExpanded
          >
            <MockedLineChart />
          </Expander>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Strategy exposure
              </Text>
            }
            defaultExpanded
          >
            <StrategyExposure rawData={strategyExposureRawData} />
          </Expander>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Rebalancing activity
              </Text>
            }
            defaultExpanded
          >
            <RebalancingActivity rawData={rebalancingActivityRawData} />
          </Expander>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                User activity
              </Text>
            }
            defaultExpanded
          >
            <UserActivity rawData={userActivityRawData} />
          </Expander>
        </div>
      }
      rightContent={
        <FormContainer fleetConfig={fleetConfig} selectedStrategyData={selectedStrategyData} />
      }
    />
  )
}

export default EarnStrategyPreviewPage
