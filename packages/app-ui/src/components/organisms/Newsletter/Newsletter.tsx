'use client'

import { type ReactNode, useState } from 'react'
import clsx from 'clsx'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { LoadingSpinner } from '@/components/molecules/Loader/Loader'

import newsletterStyles from '@/components/organisms/Newsletter/Newsletter.module.scss'

type NewsletterStatus = 'initial' | 'loading' | 'success' | 'error'

export type NewsletterPropsType = {
  newsletter: {
    enabled?: boolean
    buttonLabel: string
    description: string
    label: string
    title: string
    acknowledgement: ReactNode
    email: string
    newsletterStatus: NewsletterStatus
    newsletterStatusLabel: string
    onEmailUpdate: (email: string) => void
    onSubmit: (email: string) => void
  }
}

function NewsletterFormSuccess() {
  return (
    <div className={newsletterStyles.newsletterSuccessWrapper}>
      <div className={newsletterStyles.newsletterSuccessBackground}>
        <div className={newsletterStyles.newsletterSuccessIcon}>
          <Icon iconName="checkmark" color="white" size={21} />
        </div>
        <div
          style={{
            flex: 1,
            marginLeft: 'var(--space-xs)',
            textAlign: 'center',
          }}
        >
          <Text
            as="p"
            className={clsx(
              newsletterStyles.newsletterSuccessLabel,
              newsletterStyles.newsletterSuccessLabelTitle,
            )}
          >
            Thank you for subscribing the newsletter!
          </Text>
          <Text as="p" className={newsletterStyles.newsletterSuccessLabel}>
            Check your inbox and confirm your subscription.
          </Text>
        </div>
      </div>
    </div>
  )
}

export const Newsletter = ({ newsletter }: NewsletterPropsType): React.ReactNode => {
  const [isFocused, setIsFocused] = useState(false)
  const updateEmail = (ev: React.ChangeEvent<HTMLInputElement>) => {
    newsletter.onEmailUpdate(ev.target.value)
  }
  const handleSubmit = () => {
    newsletter.onSubmit(newsletter.email)
  }
  const handleEnter = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div>
      <Text as="h3" variant="p1semi">
        {newsletter.title}
      </Text>
      <Text as="p" variant="p2" className={newsletterStyles.newsletterDescription}>
        {newsletter.description}
      </Text>
      <div className={newsletterStyles.newsletterInput}>
        <input
          disabled={newsletter.newsletterStatus === 'loading' || !newsletter.enabled}
          className={newsletterStyles.input}
          value={newsletter.email}
          onChange={updateEmail}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleEnter}
          placeholder={newsletter.enabled ? newsletter.label : 'Temporarily disabled'}
          style={{
            pointerEvents:
              newsletter.newsletterStatus === 'loading' || !newsletter.enabled ? 'none' : 'auto',
          }}
        />
        {newsletter.newsletterStatus === 'loading' ? (
          <LoadingSpinner size={22} />
        ) : (
          <Text
            variant="p3semi"
            className={newsletterStyles.newsletterButtonLabel}
            onClick={newsletter.enabled ? handleSubmit : void 0}
            style={{
              pointerEvents: !newsletter.enabled ? 'none' : 'auto',
            }}
          >
            {newsletter.buttonLabel}
          </Text>
        )}
      </div>
      {newsletter.newsletterStatus === 'success' && <NewsletterFormSuccess />}
      {newsletter.newsletterStatusLabel && (
        <Text variant="p3" className={newsletterStyles.newsletterStatusLabel}>
          {newsletter.newsletterStatusLabel}
        </Text>
      )}
      <div
        className={clsx(newsletterStyles.acknowledgement, {
          [newsletterStyles.acknowledgementActive]:
            (isFocused || !!newsletter.email.length) && newsletter.newsletterStatus !== 'success',
        })}
      >
        {newsletter.acknowledgement}
      </div>
    </div>
  )
}
