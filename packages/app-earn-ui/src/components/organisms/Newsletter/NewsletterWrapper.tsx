'use client'

import { type CSSProperties, type FC, useState } from 'react'
import { EMAIL_REGEX } from '@summerfi/app-utils'
import Link from 'next/link'

import { Text } from '@/components/atoms/Text/Text'
import { Newsletter, type NewsletterPropsType } from '@/components/organisms/Newsletter/Newsletter'

const errorMessagesList = {
  emailIsInvalid: 'Please enter a valid email address',
  emailAlreadyExists: 'Email is already subscribed to mailing list.',
  emailPending: 'Opt-in email already sent for this address - please check your inbox.',
}

interface NewsletterWrapperProps {
  wrapperClassName?: string
  inputWrapperClassName?: string
  inputWrapperStyles?: CSSProperties
  inputBtnLabel?: string
  isEarnApp?: boolean
}

export const NewsletterWrapper: FC<NewsletterWrapperProps> = ({
  wrapperClassName,
  inputWrapperStyles,
  inputWrapperClassName,
  inputBtnLabel,
  isEarnApp = false,
}) => {
  const [email, setEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] =
    useState<NewsletterPropsType['newsletter']['newsletterStatus']>('initial')
  const [newsletterStatusLabel, setNewsletterStatusLabel] = useState('')

  const onSubmit = async (usersEmail: string) => {
    if (!usersEmail.trim() || !EMAIL_REGEX.test(usersEmail.trim())) {
      setNewsletterStatus('error')
      setNewsletterStatusLabel('Please enter a valid email address')

      return
    } else {
      setNewsletterStatus('loading')
      setNewsletterStatusLabel('')
    }
    try {
      // since we moved to static LP there is just earn apps endpoint
      const response = await fetch(`/earn/api/newsletter-subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: usersEmail }),
      })

      if (response.ok && response.status === 200) {
        setNewsletterStatus('success')
        setEmail('')
      } else {
        const responseBody = await response.json()

        if (errorMessagesList[responseBody.error as keyof typeof errorMessagesList]) {
          setNewsletterStatusLabel(
            errorMessagesList[responseBody.error as keyof typeof errorMessagesList],
          )
        }
        setNewsletterStatus('error')
      }
    } catch (error) {
      setNewsletterStatus('error')
    }
  }

  return (
    <Newsletter
      wrapperClassName={wrapperClassName}
      inputWrapperStyles={inputWrapperStyles}
      inputWrapperClassName={inputWrapperClassName}
      inputBtnLabel={inputBtnLabel}
      newsletter={{
        enabled: true,
        acknowledgement: (
          <Text
            as="p"
            variant="p3"
            style={{
              color: 'var(--earn-protocol-secondary-60)',
              marginTop: 'var(--general-space-8)',
            }}
          >
            By entering your email address, you acknowledge that Oazo Apps Limited will collect and
            process your personal data for marketing purposes (e.g. newsletter, updates). For more
            information please refer to our{' '}
            <Link prefetch={false} href="/privacy" target="_blank">
              <Text as="span" variant="p3" style={{ color: 'var(--earn-protocol-primary-100)' }}>
                Privacy Policy
              </Text>
            </Link>
            .
          </Text>
        ),
        newsletterStatus,
        newsletterStatusLabel,
        email,
        onEmailUpdate: setEmail,
        onSubmit,
      }}
    />
  )
}
