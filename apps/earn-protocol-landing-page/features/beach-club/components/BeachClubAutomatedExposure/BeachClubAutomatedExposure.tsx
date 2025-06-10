import { SectionTabs, Text } from '@summerfi/app-earn-ui'

import classNames from './BeachClubAutomatedExposure.module.css'

const sectionTabs = [
  {
    id: '1',
    title: 'Sustainably higher yields, optimized with AI',
    content: (
      <Text as="p" variant="p1" style={{ color: 'var(--earn-protocol-secondary-70)' }}>
        Earn DeFi’s best yields-automatically and effortlessly-with Summer’s AI-powered rebalancing
        that continuously reallocates your deposits across top protocols, so you save time, skip gas
        fees, and maximize returns, all for a simple 1% annual fee.
      </Text>
    ),
  },
  {
    id: '2',
    title: 'The Power of DeFi, made accessible to everyone',
    content: (
      <Text as="p" variant="p1" style={{ color: 'var(--earn-protocol-secondary-70)' }}>
        With Summer, your yield is transparent and traceable, your assets are always in your
        control, and you can exit anytime - no lockups, no middlemen, just non-custodial DeFi the
        way it should be.
      </Text>
    ),
  },
  {
    id: '3',
    title: 'Superior risk management by DeFi’s top risk team',
    content: (
      <Text as="p" variant="p1" style={{ color: 'var(--earn-protocol-secondary-70)' }}>
        Summer gives you higher yields with minimized risk through expert-managed, automatically
        diversified strategies - powered by Block Analitica’s continuous risk oversight and built-in
        safeguards that protect your capital while maximizing risk-adjusted returns.
      </Text>
    ),
  },
]

export const BeachClubAutomatedExposure = () => {
  return (
    <div className={classNames.beachClubAutomatedExposureWrapper}>
      <Text as="h2" variant="h2" style={{ marginBottom: 'var(--general-space-16)' }}>
        Automated Exposure to DeFi’s Highest quality yields
      </Text>
      <Text
        as="p"
        variant="p1"
        style={{
          color: 'var(--earn-protocol-secondary-70)',
        }}
      >
        Lazy Summer gives you sustainably higher yields, optimized with AI. Earn more, save time,
        and reduce costs.
      </Text>
      <SectionTabs
        sections={sectionTabs}
        activeSectionColor="p1semiColorfulBeachClub"
        activeTabColor="var(--beach-club-tab-underline)"
      />
    </div>
  )
}
