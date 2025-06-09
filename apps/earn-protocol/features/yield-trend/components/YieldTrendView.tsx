'use client'

import {
  Card,
  Dropdown,
  getTwitterShareUrl,
  HeadingWithCards,
  Text,
  useCurrentUrl,
} from '@summerfi/app-earn-ui'
import clsx from 'clsx'

import yieldTrendViewStyles from './YieldTrendView.module.css'

const dropdownOptions = [
  {
    content: (
      <Text variant="p3semi" style={{ color: 'var(--color-text-secondary-disabled)' }}>
        ETH Median DeFi Yield
      </Text>
    ),
    value: 'eth',
  },
  {
    content: (
      <Text variant="p3semi" style={{ color: 'var(--color-text-secondary-disabled)' }}>
        BTC Median DeFi Yield
      </Text>
    ),
    value: 'btc',
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
        description="Stop second guessing how much you should be earning on your crypto assets. Quickly see the median DeFi yield on specific assets from  top DeFi protocols, and how they compare to what you can earn by optimizing only the best of DeFi with Lazy Summer Protocol. "
      />
      <Card variant="cardSecondary">
        <div className={yieldTrendViewStyles.headerCardGrid}>
          <div className={yieldTrendViewStyles.headerCardLeft}>
            <Dropdown
              options={dropdownOptions}
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
            qwe
          </Card>
          <Card
            className={clsx(
              yieldTrendViewStyles.headerCardRight,
              yieldTrendViewStyles.headerCardBrighter,
            )}
          >
            rty
          </Card>
        </div>
      </Card>
    </div>
  )
}
