import { Card, Expander, Text } from '@summerfi/app-earn-ui'

const faqExpanders = [
  {
    title: 'Why should I trust your platform?',
    content: 'TBD',
  },
  {
    title: 'How does the strategy work?',
    content: 'TBD',
  },
  {
    title: 'Where does the yield come from?',
    content: 'TBD',
  },
  {
    title: 'What’s the platform of Summer.fi?',
    content: 'TBD',
  },
]

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
        {faqExpanders.map((item) => (
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
