import { Card, Expander, Icon, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type IconNamesList } from '@summerfi/app-types'
import Link from 'next/link'

const items: {
  text: string
  link: {
    href: string
    label: string
  }
  iconName: IconNamesList
}[] = [
  {
    text: '1 on 1 guidance and onboarding',
    link: {
      label: 'Text Link',
      href: '/',
    },
    iconName: 'person',
  },
  {
    text: 'Email support tickets for all your questions',
    link: {
      label: 'Contact us',
      href: '/',
    },
    iconName: 'question',
  },
  {
    text: 'Live chat for your immediate needs',
    link: {
      label: 'Start Chatting with us',
      href: '/',
    },
    iconName: 'discord',
  },
]

export const StrategyDetailsSecuritySupportExpander = () => {
  return (
    <Card variant="cardSecondary">
      <Expander
        title={
          <Text as="p" variant="p1semi">
            24/7 Support
          </Text>
        }
      >
        <Text
          as="p"
          variant="p2"
          style={{
            color: 'var(--earn-protocol-secondary-60)',
            marginTop: 'var(--spacing-space-medium)',
            paddingBottom: 'var(--spacing-space-medium)',
            borderBottom: '1px solid var(--earn-protocol-neutral-70)',
          }}
        >
          Summer.fi protocol has 24/7 support available for all customers.
        </Text>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 'var(--spacing-space-large)',
            flexWrap: 'wrap',
            gap: 'var(--spacing-space-large)',
          }}
        >
          {items.map((item) => (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-space-x-small)',
              }}
              key={item.text}
            >
              <Icon iconName={item.iconName} color="rgba(255, 251, 253, 1)" variant="s" />
              <Text as="p" variant="p2semi">
                {item.text}
              </Text>
              <Link href={item.link.href}>
                <WithArrow
                  as="p"
                  variant="p3semi"
                  style={{ color: 'var(--earn-protocol-primary-100)' }}
                >
                  {item.link.label}
                </WithArrow>
              </Link>
            </div>
          ))}
        </div>
      </Expander>
    </Card>
  )
}
