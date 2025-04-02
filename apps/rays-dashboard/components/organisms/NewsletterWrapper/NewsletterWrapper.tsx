'use client'

import { useState } from 'react'
import { type AppConfigType } from '@summerfi/app-types'
import { Newsletter, type NewsletterPropsType, ProxyLinkComponent } from '@summerfi/app-ui'
import { EMAIL_REGEX } from '@summerfi/app-utils'
import Link from 'next/link'

const errorMessagesList = {
  emailIsInvalid: 'Please enter a valid email address',
  emailAlreadyExists: 'Email is already subscribed to mailing list.',
  emailPending: 'Opt-in email already sent for this address - please check your inbox.',
}

export const NewsletterWrapper = ({ config }: { config: Partial<AppConfigType> }) => {
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
    // no base path, this is a call to oasis-borrow
    try {
      const response = await fetch('/api/newsletter-subscribe', {
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
      newsletter={{
        enabled: config.features?.Newsletter,
        buttonLabel: 'Subscribe →',
        description: 'Subscribe to the newsletter for updates',
        label: 'Email Address',
        title: 'Stay up to date with Summer.fi',
        acknowledgement: (
          <>
            By entering your email address, you acknowledge that Oazo Apps Limited will collect and
            process your personal data for marketing purposes (e.g. newsletter, updates). For more
            information please refer to our{' '}
            <Link passHref legacyBehavior prefetch={false} href="/privacy">
              <ProxyLinkComponent
                style={{
                  color: 'var(--color-interactive-100)',
                  textDecoration: 'none',
                }}
                target="_blank"
              >
                Privacy Policy
              </ProxyLinkComponent>
            </Link>
            .
          </>
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
