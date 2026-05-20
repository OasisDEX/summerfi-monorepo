'use client'

import { useState } from 'react'
import { Card, Expander, FaqSection, Icon, Text } from '@summerfi/app-earn-ui'

import classNames from '@/features/dca/components/dca.module.css'

const faqs = [
  {
    id: 'are-eth-usdt-and-usdc-the-only-assets',
    title: <Text variant="p3semi">Are ETH, USDT, and USDC the only assets available?</Text>,
    content: <Text variant="p3">For now, yes.</Text>,
  },
  {
    id: 'do-i-have-to-go-from-one-summer-vault-to-another',
    title: <Text variant="p3semi">Do you have to go from one Summer vault to another?</Text>,
    content: (
      <Text variant="p3">
        Yes, vault-to-vault by design. Your capital keeps earning yield on both sides of every swap.
      </Text>
    ),
  },
  {
    id: 'where-do-you-execute-the-trades',
    title: <Text variant="p3semi">Where do you execute the trades?</Text>,
    content: (
      <Text variant="p3">
        Onchain via DEX aggregators that route each swap to the best price across major DEXes.
      </Text>
    ),
  },
  {
    id: 'how-do-i-know-ill-get-a-good-execution-price',
    title: <Text variant="p3semi">How do I know I&apos;ll get a good execution price?</Text>,
    content: (
      <Text variant="p3">Aggregator routing, your max price cap, and low slippage tolerance.</Text>
    ),
  },
  {
    id: 'what-happens-if-my-max-price-is-hit',
    title: <Text variant="p3semi">What happens if my max price is hit?</Text>,
    content: (
      <Text variant="p3">
        You buy or sell will be skipped. The strategy resumes at the next interval if the price is
        back under your max.
      </Text>
    ),
  },
  {
    id: 'what-happens-when-the-source-vault-is-depleted',
    title: <Text variant="p3semi">What happens when the source vault is depleted?</Text>,
    content: (
      <Text variant="p3">
        The strategy pauses automatically. Top up the source vault to resume.
      </Text>
    ),
  },
  {
    id: 'can-i-run-multiple-dca-strategies-at-once',
    title: <Text variant="p3semi">Can I run multiple DCA strategies at once?</Text>,
    content: (
      <Text variant="p3">
        Yes, one per source vault, but you can run several across different source vaults.
      </Text>
    ),
  },
  {
    id: 'can-i-pause-edit-or-cancel-an-active-dca-strategy',
    title: <Text variant="p3semi">Can I pause, edit, or cancel an active DCA strategy?</Text>,
    content: <Text variant="p3">Yes pause, edit, or cancel any active strategy at any time.</Text>,
  },
  {
    id: 'is-there-a-minimum-deposit-or-minimum-tranche-size',
    title: <Text variant="p3semi">Is there a minimum deposit or minimum tranche size?</Text>,
    content: <Text variant="p3">No minimum deposit and no minimum swap size.</Text>,
  },
  {
    id: 'are-there-protocol-fees-for-dca',
    title: <Text variant="p3semi">Are there protocol fees for DCA?</Text>,
    content: (
      <Text variant="p3">No, DCA is free. You only pay normal vault fees and network gas.</Text>
    ),
  },
  {
    id: 'how-is-this-different-from-a-recurring-buy-on-a-dex-or-cex',
    title: (
      <Text variant="p3semi">How is this different from a recurring buy on a DEX or CEX?</Text>
    ),
    content: (
      <Text variant="p3">
        Best in class yield, always. Your capital keeps earning yield in the source and target
        vaults.
      </Text>
    ),
  },
]

export const DCASidebar = () => {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <Card variant="cardSecondary" className={classNames.faqCard}>
      <Expander
        expanded={expanded === 'what-is-dca'}
        onExpand={() => setExpanded(expanded === 'what-is-dca' ? null : 'what-is-dca')}
        title={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Icon
              iconName="info"
              size={22}
              color={expanded === 'what-is-dca' ? 'var(--earn-protocol-primary-100)' : ''}
            />
            <Text variant="p2semi">What is DCA?</Text>
          </div>
        }
      >
        <div style={{ paddingLeft: '14px' }}>
          <Text variant="p3">
            Dollar-cost averaging is the discipline of buying or selling a fixed amount on a
            recurring schedule, smoothing out volatility so you accumulate assets like ETH on the
            way up or take profit into stables like USDC on the way down without ever having to time
            the market.
          </Text>
        </div>
      </Expander>
      <Expander
        expanded={expanded === 'how-dca-works'}
        onExpand={() => setExpanded(expanded === 'how-dca-works' ? null : 'how-dca-works')}
        title={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Icon
              iconName="cog"
              size={22}
              color={expanded === 'how-dca-works' ? 'var(--earn-protocol-primary-100)' : ''}
            />
            <Text variant="p2semi">How DCA works on Summer.fi?</Text>
          </div>
        }
      >
        <div style={{ paddingLeft: '14px' }}>
          <Text variant="p3">
            You choose your pair, size, and cadence, and Summer.fi runs the strategy non-custodially
            while earning yield on both sides. Your USDC keeps earning until it buys, and your ETH
            starts earning the moment its bought (or vice versa) so you get paid to accumulate the
            assets you believe in.
          </Text>
        </div>
      </Expander>
      <Expander
        expanded={expanded === 'dca-faqs'}
        onExpand={() => setExpanded(expanded === 'dca-faqs' ? null : 'dca-faqs')}
        title={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Icon
              iconName="question_o"
              size={22}
              color={expanded === 'dca-faqs' ? 'var(--earn-protocol-primary-100)' : ''}
            />
            <Text variant="p2semi">DCA FAQ&apos;s</Text>
          </div>
        }
      >
        <FaqSection data={faqs} customTitle="" />
      </Expander>
    </Card>
  )
}
