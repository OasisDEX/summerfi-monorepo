import { Card, Expander, LinkCard, type LinkCardWithIconName, Text } from '@summerfi/app-earn-ui'

const auditCards: LinkCardWithIconName[] = [
  {
    title: 'Chain Security',
    description: '0 critical bugs',
    link: {
      href: 'https://www.chainsecurity.com/smart-contract-audit-reports',
      label: 'View full report',
    },
    iconName: 'chain_security',
  },
  {
    title: 'Bug Bounty Program',
    description: 'Maximum Bounty: $100,000',
    link: {
      href: 'https://immunefi.com/bug-bounty/summerfi/information/',
      label: 'View bug bounty',
    },
    iconName: 'bug',
  },
]

export const VaultDetailsSecurityAuditsExpander = () => {
  return (
    <Card>
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
            <LinkCard
              key={item.title}
              title={item.title}
              description={item.description}
              link={item.link}
              iconName={item.iconName}
              variant="cardSecondarySmallPaddings"
              style={{ background: 'var(--earn-protocol-neutral-80)' }}
              target="_blank"
            />
          ))}
        </div>
      </Expander>
    </Card>
  )
}
