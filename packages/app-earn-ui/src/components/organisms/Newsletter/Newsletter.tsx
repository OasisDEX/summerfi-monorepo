'use client'

import { type CSSProperties, type ReactNode, useState } from 'react'
import clsx from 'clsx'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Input } from '@/components/atoms/Input/Input'
import { Text } from '@/components/atoms/Text/Text'
import { WithArrow } from '@/components/atoms/WithArrow/WithArrow'
import { LoadingSpinner } from '@/components/molecules/LoadingSpinner/LoadingSpinner'

import newsletterStyles from '@/components/organisms/Newsletter/Newsletter.module.css'

type NewsletterStatus = 'initial' | 'loading' | 'success' | 'error'

export type NewsletterPropsType = {
  newsletter: {
    enabled?: boolean
    acknowledgement: ReactNode
    email: string
    newsletterStatus: NewsletterStatus
    newsletterStatusLabel: string
    onEmailUpdate: (email: string) => void
    onSubmit: (email: string) => void
  }
  wrapperClassName?: string
  inputWrapperClassName?: string
  inputWrapperStyles?: CSSProperties
  inputBtnLabel?: string
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

export const Newsletter = ({
  newsletter,
  wrapperClassName,
  inputWrapperClassName,
  inputWrapperStyles,
  inputBtnLabel = 'Join',
}: NewsletterPropsType): React.ReactNode => {
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
    <div className={wrapperClassName}>
      <div className={newsletterStyles.newsletterInput}>
        <Input
          disabled={newsletter.newsletterStatus === 'loading' || !newsletter.enabled}
          value={newsletter.email}
          onChange={updateEmail}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleEnter}
          style={{
            pointerEvents:
              newsletter.newsletterStatus === 'loading' || !newsletter.enabled ? 'none' : 'auto',
          }}
          variant="withBorder"
          placeholder="Type email here"
          button={
            newsletter.newsletterStatus === 'loading' ? (
              <LoadingSpinner size={22} />
            ) : (
              <WithArrow as="p" withAnimated variant="p3semiColorful" onClick={handleSubmit}>
                {inputBtnLabel}
              </WithArrow>
            )
          }
          wrapperStyles={{ fontSize: '14px', ...inputWrapperStyles }}
          wrapperClassName={inputWrapperClassName}
        />
      </div>
      {newsletter.newsletterStatus === 'success' && <NewsletterFormSuccess />}
      {newsletter.newsletterStatusLabel && (
        <Text
          as="p"
          variant="p3"
          className={newsletterStyles.newsletterStatusLabel}
          style={{
            color: 'var(--earn-protocol-critical-100)',
            marginTop: 'var(--general-space-8)',
          }}
        >
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
