import { Card, Expander, Text } from '@summerfi/app-earn-ui'

import { vaultFaqData } from './vault-faq-data'

export const VaultDetailsFaq = () => {
  return (
    <Card variant="cardSecondary">
      <div
        id="faq"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <Text as="h5" variant="h5" style={{ marginBottom: 'var(--spacing-space-medium)' }}>
          FAQ
        </Text>
        {vaultFaqData.map((item) => (
          <div
            key={item.title}
            style={{
              paddingTop: 'var(--spacing-space-medium-large)',
              paddingBottom: 'var(--spacing-space-medium-large)',
              borderBottom: '1px solid var(--earn-protocol-neutral-70)',
              width: '100%',
            }}
          >
            <Expander
              key={item.title}
              title={
                <Text as="p" variant="p2semi">
                  {item.title}
                </Text>
              }
            >
              <div
                style={{
                  paddingTop: 'var(--spacing-space-medium-large)',
                  paddingBottom: 'var(--spacing-space-medium)',
                }}
              >
                {item.content}
              </div>
            </Expander>
          </div>
        ))}
      </div>
    </Card>
  )
}
