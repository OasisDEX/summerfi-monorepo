'use client'

import { type ChangeEvent, type FormEvent, useState } from 'react'
import { Button, CheckboxButton, LoadingSpinner, Text } from '@summerfi/app-earn-ui'
import { handleCaptcha, RECAPTCHA_SITE_KEY } from '@summerfi/app-utils'
import Link from 'next/link'
import Script from 'next/script'
import { z } from 'zod'

import styles from './LandingPageContactForm.module.css'

const landingPageContactFormFormSchema = z.object({
  formType: z.enum(['rwa', 'own-vault', 'integrations']),
  companyName: z
    .string()
    .nonempty('Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  personalName: z.string().max(60, 'Personal name must be less than 60 characters').optional(),
  phoneNumber: z
    .string()
    .nonempty('Phone number is required')
    .min(6, 'Phone number must be at least 6 characters')
    .max(20, 'Phone number must be less than 20 characters'),
  businessEmail: z
    .string()
    .nonempty('Email is required')
    .email('Please enter a valid email address'),
  primaryInterest: z.string().nonempty('Primary interest is required'),
  jobRole: z
    .string()
    .nonempty('Job role is required')
    .min(2, 'Job role must be at least 2 characters')
    .max(80, 'Job role must be less than 80 characters'),
  message: z.string().max(500, 'Message must be less than 500 characters').optional(),
  consent: z.boolean().refine((value) => value, {
    message: 'You must consent to the processing of your personal data',
  }),
})

type LandingPageContactFormValues = z.infer<typeof landingPageContactFormFormSchema>
type LandingPageContactFormErrors = {
  [key: string]: string[] | undefined
}
type FormChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

export const LandingPageContactForm = ({
  formType,
}: {
  formType: 'rwa' | 'own-vault' | 'integrations'
}) => {
  const [formValues, setFormValues] = useState<LandingPageContactFormValues>({
    formType,
    companyName: '',
    personalName: '',
    phoneNumber: '',
    businessEmail: '',
    primaryInterest: '',
    jobRole: '',
    message: '',
    consent: false,
  })
  const [formErrors, setFormErrors] = useState<LandingPageContactFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const primaryInterestOptions = {
    rwa: [
      { label: 'Select', value: '' },
      { label: 'Deploying capital into the Vault', value: 'deploying-capital-into-the-vault' },
      {
        label: 'Integrating the Vault into our own product',
        value: 'integrating-the-vault-into-our-own-product',
      },
      {
        label: 'Discussing a new market or tokenised asset',
        value: 'discussing-a-new-market-or-tokenised-asset',
      },
      { label: 'Deploy and manage a similar Vault', value: 'deploy-and-manage-a-similar-vault' },
    ],
    'own-vault': [
      { label: 'Select', value: '' },
      {
        label: 'Interested in launching our own Vault',
        value: 'interested-in-launching-our-own-vault',
      },
      {
        label: 'Integrating an existing custom Vault',
        value: 'integrating-an-existing-custom-vault',
      },
      { label: 'Other', value: 'other' },
    ],
    integrations: [
      { label: 'Select', value: '' },
      { label: 'Interested in integrating', value: 'interested-in-integrating' },
      {
        label: 'Learn more about the revenue share opportunity',
        value: 'learn-more-about-revenue-share-opportunity',
      },
      {
        label: 'Technical support for new integration',
        value: 'technical-support-for-new-integration',
      },
      {
        label: 'Technical support for existing integration',
        value: 'technical-support-for-existing-integration',
      },
      { label: 'Other', value: 'other' },
    ],
  }[formType]

  const resetForm = () => {
    setFormValues({
      formType,
      companyName: '',
      personalName: '',
      phoneNumber: '',
      businessEmail: '',
      primaryInterest: '',
      jobRole: '',
      message: '',
      consent: false,
    })
    setFormErrors({})
  }

  const handleFieldChange = (e: FormChangeEvent) => {
    const { name: fieldName, value } = e.target

    setFormErrors((prev) => ({
      ...prev,
      [fieldName]: [],
    }))

    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  const handleConsentChange = () => {
    setFormErrors((prev) => ({
      ...prev,
      consent: [],
    }))

    setFormValues((prev) => ({
      ...prev,
      consent: !prev.consent,
    }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormErrors({})
    setIsSubmitting(true)

    const parsedForm = landingPageContactFormFormSchema.safeParse(formValues)

    if (!parsedForm.success) {
      setFormErrors(parsedForm.error.flatten().fieldErrors as LandingPageContactFormErrors)
      setIsSubmitting(false)

      return
    }

    const isDev = process.env.NODE_ENV !== 'production'
    const backendFormPath = '/earn/api/landing-page-forms/submit'
    const formEndpoint = isDev ? `http://localhost:3002${backendFormPath}` : backendFormPath

    void handleCaptcha({
      formValues,
      formEndpoint,
      resetForm,
      setIsSubmitting,
      setIsSubmitted,
      setFormErrors,
    }).then((success) => {
      if (!success) {
        setIsSubmitted(false)
      }
    })
  }

  const headerContent = {
    rwa: <>Want to learn more about Summer.fi&apos;s Private access RWA vaults?</>,
    'own-vault': <>Want to learn more about building your own vault with Summer.fi ?</>,
    integrations: <>Want to learn more about intergrating Summer Vaults into your app?</>,
  }[formType]

  return (
    <section className={styles.wrapper} id="contact-form">
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
        strategy="lazyOnload"
      />
      <div className={styles.leftColumn}>
        <Text variant="h3" as="h3">
          {headerContent}
        </Text>
      </div>
      <form className={styles.formColumn} onSubmit={handleSubmit}>
        <input type="hidden" name="formType" value={formType} />
        <Text variant="p2semi" as="p">
          Request more information:
        </Text>
        <Text variant="p3" as="p" className={styles.subtitle}>
          Once you submit this form, a member of the Summer.fi institutional team will contact you
          to discuss your specifications and questions.
        </Text>

        <div className={styles.formField}>
          <label htmlFor="companyName">
            <Text variant="p4semi" as="span">
              Company Name <span className={styles.required}>*</span>
            </Text>
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            className={styles.formInput}
            value={formValues.companyName}
            placeholder="Crypto Corp LLC"
            onChange={handleFieldChange}
            disabled={isSubmitting || isSubmitted}
          />
          <Text variant="p4" as="p" className={styles.errorText}>
            {formErrors.companyName?.[0] ?? <>&nbsp;</>}
          </Text>
        </div>

        <div className={styles.formField}>
          <label htmlFor="personalName">
            <Text variant="p4semi" as="span">
              Personal Name
            </Text>
          </label>
          <input
            id="personalName"
            name="personalName"
            type="text"
            className={styles.formInput}
            value={formValues.personalName ?? ''}
            placeholder="John Doe"
            onChange={handleFieldChange}
            disabled={isSubmitting || isSubmitted}
          />
          <Text variant="p4" as="p" className={styles.errorText}>
            {formErrors.personalName?.[0] ?? <>&nbsp;</>}
          </Text>
        </div>

        <div className={styles.sideFormFields}>
          <div className={styles.formField}>
            <label htmlFor="phoneNumber">
              <Text variant="p4semi" as="span">
                Phone Number (incl. country code) <span className={styles.required}>*</span>
              </Text>
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              className={styles.formInput}
              value={formValues.phoneNumber}
              placeholder="20 7946 0000"
              onChange={handleFieldChange}
              disabled={isSubmitting || isSubmitted}
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="businessEmail">
              <Text variant="p4semi" as="span">
                Business Email <span className={styles.required}>*</span>
              </Text>
            </label>
            <input
              id="businessEmail"
              name="businessEmail"
              type="email"
              className={styles.formInput}
              value={formValues.businessEmail}
              placeholder="business@email.com"
              onChange={handleFieldChange}
              disabled={isSubmitting || isSubmitted}
            />
            <Text variant="p4" as="p" className={styles.errorText}>
              {formErrors.businessEmail?.[0] ?? <>&nbsp;</>}
            </Text>
          </div>
        </div>

        <div className={styles.formField}>
          <label htmlFor="jobRole">
            <Text variant="p4semi" as="span">
              Job Role <span className={styles.required}>*</span>
            </Text>
          </label>
          <input
            id="jobRole"
            name="jobRole"
            type="text"
            className={styles.formInput}
            value={formValues.jobRole}
            placeholder="e.g. Head of Trading"
            onChange={handleFieldChange}
            disabled={isSubmitting || isSubmitted}
          />
          <Text variant="p4" as="p" className={styles.errorText}>
            {formErrors.jobRole?.[0] ?? <>&nbsp;</>}
          </Text>
        </div>

        <div className={styles.formField}>
          <label htmlFor="primaryInterest">
            <Text variant="p4semi" as="span">
              What is your primary interest? <span className={styles.required}>*</span>
            </Text>
          </label>
          <select
            id="primaryInterest"
            name="primaryInterest"
            className={styles.formSelect}
            value={formValues.primaryInterest}
            onChange={handleFieldChange}
            disabled={isSubmitting || isSubmitted}
          >
            {primaryInterestOptions.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Text variant="p4" as="p" className={styles.errorText}>
            {formErrors.primaryInterest?.[0] ?? <>&nbsp;</>}
          </Text>
        </div>

        <div className={styles.formField}>
          <label htmlFor="message">
            <Text variant="p4semi" as="span">
              Message
            </Text>
          </label>
          <textarea
            id="message"
            name="message"
            className={styles.formTextArea}
            value={formValues.message ?? ''}
            placeholder="Any additional information you want to share"
            onChange={handleFieldChange}
            rows={5}
            disabled={isSubmitting || isSubmitted}
          />
          <Text variant="p4" as="p" className={styles.errorText}>
            {formErrors.message?.[0] ?? <>&nbsp;</>}
          </Text>
        </div>

        <div>
          <CheckboxButton
            checked={formValues.consent}
            name="consent"
            label={
              <Text variant="p4" as="p" className={styles.consentText}>
                I consent to the processing of my personal data by OAZO APPS LIMITED collect through
                Getform for the purposes of receiving information about Summer.fi&apos;s programmes,
                products and services. <span className={styles.required}>*</span>
              </Text>
            }
            labelStyles={{
              position: 'static',
              paddingLeft: '22px',
            }}
            onChange={handleConsentChange}
          />
        </div>
        <Text variant="p4" as="p" className={styles.errorText}>
          {formErrors.consent?.[0] ?? <>&nbsp;</>}
        </Text>

        <div className={styles.statusRow}>
          <Text variant="p4semi" as="p" className={styles.errorText}>
            {formErrors.global?.[0] ?? ''}
          </Text>
          <Text variant="p4semi" as="p" className={styles.successText}>
            {isSubmitted ? 'Thank you for your submission! We will get back to you soon.' : ''}
          </Text>
        </div>

        <div className={styles.actionsRow}>
          <Button
            variant="primaryMedium"
            type="submit"
            disabled={isSubmitting || isSubmitted}
            style={{ minWidth: '120px' }}
          >
            {isSubmitting ? <LoadingSpinner size={14} /> : 'Submit'}
          </Button>
        </div>

        <div className={styles.bottomCopy}>
          <Text variant="p4" as="p">
            Have any questions?
          </Text>
          <Text variant="p4" as="p">
            Drop us a line at{' '}
            <Link href="mailto:institutions@summer.fi" className={styles.emailLink}>
              institutions@summer.fi
            </Link>
          </Text>
        </div>
      </form>
    </section>
  )
}
