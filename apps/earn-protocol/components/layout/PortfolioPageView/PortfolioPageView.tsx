'use client'

import { type FC } from 'react'
import { Button, DataBlock, Icon, Text } from '@summerfi/app-earn-ui'

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
          marginTop: 'var(--spacing-space-x-large)',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--spacing-space-x-small)', alignItems: 'center' }}>
          <Icon iconName="question_o" color="rgba(255, 73, 164, 1)" />
          <Text as="p" variant="p1semi">
            {walletAddress}
          </Text>
          <Icon iconName="question_o" color="rgba(255, 73, 164, 1)" />
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-space-large)', alignItems: 'center' }}>
          <DataBlock title="Total $SUMR" value="313" valueSize="large" />
          <DataBlock title="Total Wallet Value" value="$2.3m" valueSize="large" />
        </div>
      </div>
    </div>
  )
}
