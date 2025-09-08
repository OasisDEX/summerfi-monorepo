'use client'
import { Card, Expander, Icon, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type IconNamesList } from '@summerfi/app-types'
import Link from 'next/link'

import { useHandleButtonClickEvent } from '@/hooks/use-mixpanel-event'

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
      label: 'Sign up',
      href: 'https://cal.com/jordan-jackson-d278ib/summer.fi-support-call',
    },
    iconName: 'earn_1_on_1',
  },
  {
    text: 'Email support tickets for all your questions',
    link: {
      label: 'Contact us',
      href: 'https://docs.summer.fi/get-in-touch/contact-us',
    },
    iconName: 'earn_email',
  },
  {
    text: 'Live chat for your immediate needs',
    link: {
      label: 'Start chatting',
      href: 'https://chat.summer.fi',
    },
    iconName: 'earn_discord',
  },
]

export const VaultDetailsSecuritySupportExpander = () => {
  const handleButtonClick = useHandleButtonClickEvent()

  const handleExpanderToggle = (expanderId: string) => (isOpen: boolean) => {
    handleButtonClick(`vault-details-expander-${expanderId}-${isOpen ? 'open' : 'close'}`)
  }

  return (
    <Card>
      <Expander
        title={
          <Text as="p" variant="p1semi">
            24/7 Support
          </Text>
        }
        onExpand={handleExpanderToggle('support')}
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
              <Icon iconName={item.iconName} color="rgba(255, 251, 253, 1)" variant="l" />
              <Text as="p" variant="p2semi">
                {item.text}
              </Text>
              <Link href={item.link.href} target="_blank">
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
