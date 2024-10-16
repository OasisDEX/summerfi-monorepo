'use client'

import { type FC } from 'react'
import { Button, DataBlock, Icon, TabBar, Text } from '@summerfi/app-earn-ui'
import { formatAddress } from '@summerfi/app-utils'

const tabs = [
  { label: 'Overview', content: <div>Overview content here</div> },
  { label: 'Wallet', content: <div>Wallet content here</div> },
  { label: 'Rebalance Activity', content: <div>Rebalance content here</div> },
  { label: 'Rewards', content: <div>Rewards content here</div> },
]

interface PortfolioPageViewProps {
  walletAddress: string
}

export const PortfolioPageView: FC<PortfolioPageViewProps> = ({ walletAddress }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Text as="h2" variant="h2">
          Portfolio
        </Text>
        <div style={{ display: 'flex', gap: 'var(--spacing-space-x-small)' }}>
          <Button variant="secondaryLarge" style={{ minWidth: 'unset' }}>
            Send
          </Button>
          <Button variant="secondaryLarge" style={{ minWidth: 'unset' }}>
            Swap
          </Button>
          <Button variant="primaryLarge" style={{ minWidth: '156px' }}>
            Add funds
            <Icon iconName="chevron_down" color="rgba(255, 251, 253, 1)" variant="xs" />
          </Button>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginTop: 'var(--general-space-40)',
          marginBottom: 'var(--general-space-40)',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--spacing-space-x-small)', alignItems: 'center' }}>
          <Icon iconName="question_o" color="rgba(255, 73, 164, 1)" />
          <Text as="p" variant="p1semi">
            {formatAddress(walletAddress, { first: 6 })}
          </Text>
          <Icon iconName="edit" color="rgba(255, 73, 164, 1)" variant="s" />
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-space-large)', alignItems: 'center' }}>
          <DataBlock
            title="Total $SUMR"
            value="313"
            titleSize="large"
            valueSize="large"
            valueStyle={{ textAlign: 'right' }}
          />
          <DataBlock
            title="Total Wallet Value"
            value="$2.3m"
            titleSize="large"
            valueSize="large"
            valueStyle={{ textAlign: 'right' }}
          />
        </div>
      </div>
      <TabBar tabs={tabs} />
    </div>
  )
}
