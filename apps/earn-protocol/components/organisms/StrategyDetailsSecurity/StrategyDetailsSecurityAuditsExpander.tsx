import { Card, Expander, Icon, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type IconNamesList } from '@summerfi/app-types'
import Link from 'next/link'

const auditCards: {
  title: string
  description: string
  link: { href: string; label: string }
  iconName: IconNamesList
}[] = [
  {
    title: 'Trail of bits',
    description: '0 critical bugs',
    link: { href: '/', label: 'View full report' },
    iconName: 'trail_of_bits',
  },
  {
    title: 'Quant Stamp',
    description: '0 critical bugs',
    link: { href: '/', label: 'View full report' },
    iconName: 'quant_stamp',
  },
  {
    title: 'Chain Security',
    description: '0 critical bugs',
    link: { href: '/', label: 'View full report' },
    iconName: 'chain_security',
  },
  {
    title: 'Bug Bounty Program',
    description: 'Max Payout: $2,000,000',
    link: { href: '/', label: 'View bug bounty' },
    iconName: 'bug',
  },
]

export const StrategyDetailsSecurityAuditsExpander = () => {
  return (
    <Card variant="cardSecondary">
      <Expander
        title={
          <Text as="p" variant="p1semi">
            Audits
          </Text>
        }
      >
        <Text
          as="p"
          variant="p2"
          style={{
            color: 'var(--earn-protocol-secondary-60)',
            marginTop: 'var(--spacing-space-medium)',
            marginBottom: 'var(--spacing-space-x-large)',
          }}
        >
          Security reports are rigorous technical audits conducted by third party firms.
        </Text>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-space-x-small)' }}
        >
          {auditCards.map((item) => (
            <Card
              variant="cardSecondarySmallPaddings"
              key={item.title}
              style={{ background: 'var(--earn-protocol-neutral-80)' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 'var(--spacing-space-medium)',
                    alignItems: 'center',
                  }}
                >
                  <Icon iconName={item.iconName} variant="m" />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-space-2x-small)',
                    }}
                  >
                    <Text as="p" variant="p2">
                      {item.title}
                    </Text>
                    <Text
                      as="p"
                      variant="p3"
                      style={{ color: 'var(--earn-protocol-secondary-60)' }}
                    >
                      {item.description}
                    </Text>
                  </div>
                </div>
                <Link
                  href={item.link.href}
                  style={{ marginRight: 'var(--spacing-space-medium-large)' }}
                >
                  <WithArrow
                    as="p"
                    variant="p3semi"
                    style={{ color: 'var(--earn-protocol-primary-100)' }}
                  >
                    {item.link.label}
                  </WithArrow>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Expander>
    </Card>
  )
}
