import { type IconNamesList } from '@summerfi/app-types'
import Link from 'next/link'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { WithArrow } from '@/components/atoms/WithArrow/WithArrow'
import { isOutsideLink } from '@/helpers/is-outside-link'

import supportBoxStyles from './SupportBox.module.css'

const SupportBoxElement = ({
  icon,
  description,
  urlLabel,
  url,
}: {
  icon: IconNamesList
  description: string
  urlLabel: string
  url: string
}) => {
  return (
    <div className={supportBoxStyles.supportBox}>
      <Icon iconName={icon} color="white" size={32} />
      <Text as="p" variant="p2semi">
        {description}
      </Text>
      <Link
        href={url}
        target={isOutsideLink(url) ? '_blank' : undefined}
        style={{ marginTop: '-8px' }}
      >
        <Text as="p" variant="p3semi">
          <WithArrow as="span" variant="p3semi">
            {urlLabel}
          </WithArrow>
        </Text>
      </Link>
    </div>
  )
}

export const SupportBox = (): React.ReactNode => {
  return (
    <div className={supportBoxStyles.supportBoxWrapper}>
      <div className={supportBoxStyles.supportBoxTitleBarWrapper}>
        <div className={supportBoxStyles.supportBoxTitleBar}>
          <Text as="p" variant="p1semi">
            24/7 Support
          </Text>
          <Text as="p" variant="p2" style={{ color: 'var(--color-text-secondary)' }}>
            Summer.fi protocol has 24/7 support available for all customers.
          </Text>
        </div>
      </div>
      <div className={supportBoxStyles.supportBoxesWrapper}>
        <SupportBoxElement
          icon="earn_1_on_1"
          description="1 on 1 guidance and onboarding"
          urlLabel="Sign up"
          url="https://cal.com/jordan-jackson-d278ib/summer.fi-support-call"
        />
        <SupportBoxElement
          icon="earn_email"
          description="Email support tickets for all your questions"
          urlLabel="Contact us"
          url="https://docs.summer.fi/get-in-touch/contact-us"
        />
        <SupportBoxElement
          icon="earn_discord"
          description="Live chat for your immediate needs"
          urlLabel="Start chatting"
          url="https://chat.summer.fi"
        />
      </div>
    </div>
  )
}
