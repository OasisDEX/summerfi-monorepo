'use client'

import {
  Button,
  Card,
  Dropdown,
  getTwitterShareUrl,
  HeadingWithCards,
  Input,
  Text,
  useCurrentUrl,
  VaultTitleDropdownContentBlock,
} from '@summerfi/app-earn-ui'
import { type SDKVaultType } from '@summerfi/app-types'
import clsx from 'clsx'

import yieldTrendViewStyles from './YieldTrendView.module.css'

const mockedVault = {
  id: 'usdc-vault',
  inputToken: {
    symbol: 'USDC',
  },
  protocol: {
    network: 'MAINNET',
  },
  customFields: {
    risk: 'lower',
  },
} as unknown as SDKVaultType

const tokenDropdownOptions = [
  {
    content: (
      <Text variant="p3semi" style={{ color: 'var(--color-text-secondary-disabled)' }}>
        this
      </Text>
    ),
    value: 'this',
  },
  {
    content: (
      <Text variant="p3semi" style={{ color: 'var(--color-text-secondary-disabled)' }}>
        is
      </Text>
    ),
    value: 'is',
  },
  {
    content: (
      <Text variant="p3semi" style={{ color: 'var(--color-text-secondary-disabled)' }}>
        a
      </Text>
    ),
    value: 'a',
  },
  {
    content: (
      <Text variant="p3semi" style={{ color: 'var(--color-text-secondary-disabled)' }}>
        mock
      </Text>
    ),
    value: 'mock',
  },
  {
    content: (
      <Text variant="p3semi" style={{ color: 'var(--color-text-secondary-disabled)' }}>
        USDC Median DeFi Yield
      </Text>
    ),
    value: 'usdc',
  },
]

export const YieldTrendView = () => {
  const currentUrl = useCurrentUrl()

  return (
    <div className={yieldTrendViewStyles.wrapper}>
      <HeadingWithCards
        title="DeFi Yield"
        social={{
          linkToCopy: currentUrl,
          linkToShare: getTwitterShareUrl({
            url: currentUrl,
            text: 'Check out the latest DeFi yield trends and how Lazy Summer Protocol optimizes yields with AI!',
          }),
        }}
        description="Stop second guessing how much you should be earning on your crypto assets. Quickly see the median DeFi yield on specific assets from  top DeFi protocols, and how they compare to what you can earn by optimizing only the best of DeFi with Lazy Summer Protocol."
      />
      <Card variant="cardSecondary">
        <div className={yieldTrendViewStyles.headerCardGrid}>
          <div className={yieldTrendViewStyles.headerCardLeft}>
            <Dropdown
              options={tokenDropdownOptions}
              dropdownValue={{ content: 'All Assets', value: 'all' }}
            >
              <Text variant="p1semi" style={{ color: 'var(--color-text-secondary-disabled)' }}>
                USDC Median DeFi Yield
              </Text>
            </Dropdown>
            <Text variant="h3">4.31%</Text>
            <Text variant="p4semi" style={{ color: 'var(--color-text-secondary)' }}>
              Median yield across markets for a specific asset, calculated for all protocols
              supported on DeFiLlama.
            </Text>
            <div className={yieldTrendViewStyles.divider} />
            <div className={yieldTrendViewStyles.headerCardLeftAPY}>
              <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
                30d APY
              </Text>
              <Text variant="p3semi">3.22%</Text>
            </div>
            <div className={yieldTrendViewStyles.headerCardLeftAPY}>
              <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
                90d APY
              </Text>
              <Text variant="p3semi">3.91%</Text>
            </div>
          </div>
          <Card
            className={clsx(
              yieldTrendViewStyles.headerCardCenter,
              yieldTrendViewStyles.headerCardBrighter,
            )}
          >
            <Text variant="p1semi" style={{ color: 'var(--color-text-primary-disabled)' }}>
              Lazy Summer Yield
            </Text>
            <Text variant="h3colorful">10.72%</Text>
            <Text variant="p4semi" style={{ color: 'var(--color-text-secondary)' }}>
              Current yield for a specific asset on Summer.fi, continuously optimized across the top
              protocols by AI powered keepers.
            </Text>
            <div className={yieldTrendViewStyles.divider} />
            <div className={yieldTrendViewStyles.headerCardLeftAPY}>
              <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
                30d APY
              </Text>
              <Text variant="p3semi">10.22%</Text>
            </div>
            <div className={yieldTrendViewStyles.headerCardLeftAPY}>
              <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
                90d APY
              </Text>
              <Text variant="p3semi">10.91%</Text>
            </div>
          </Card>
          <Card
            className={clsx(
              yieldTrendViewStyles.headerCardRight,
              yieldTrendViewStyles.headerCardBrighter,
            )}
          >
            <Text variant="p2semi" style={{ color: 'var(--color-text-secondary)' }}>
              Deposit
            </Text>
            <Card className={yieldTrendViewStyles.depositCard}>
              <Dropdown
                options={tokenDropdownOptions}
                dropdownValue={{ content: 'All Assets', value: 'all' }}
              >
                <VaultTitleDropdownContentBlock
                  vault={mockedVault}
                  style={{
                    minWidth: '250px',
                  }}
                />
              </Dropdown>
            </Card>
            <Card className={yieldTrendViewStyles.depositCard}>
              <Input width={250} placeholder="0.00" value="1000" variant="wrapper" />
            </Card>
            <Text
              variant="p2semi"
              style={{
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--spacing-space-medium)',
              }}
            >
              You would earn an extra (a year)
            </Text>
            <Text variant="h3colorful">$6,411</Text>
            <Button variant="primaryMedium" style={{ marginTop: 'var(--spacing-space-medium)' }}>
              Deposit
            </Button>
          </Card>
        </div>
      </Card>
    </div>
  )
}
