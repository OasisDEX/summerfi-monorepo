'use client'

import { type ChangeEvent, type FC, useState } from 'react'
import {
  AnimateHeight,
  Button,
  Card,
  Emphasis,
  Input,
  LoadingSpinner,
  Text,
  ToggleButton,
} from '@summerfi/app-earn-ui'
import { handleCaptcha, RECAPTCHA_SITE_KEY } from '@summerfi/app-utils'
import Link from 'next/link'
import Script from 'next/script'
import { z } from 'zod'

import institutionsContactFormStyles from './InstitutionsContactForm.module.css'

const institutionsFormSchema = z.object({
  companyName: z
    .string()
    .nonempty('Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  personalName: z.string().max(30, 'Personal name must be less than 30 characters').optional(),
  phoneNumber: z
    .string()
    .nonempty('Phone number is required')
    .min(10, 'Phone number must be at least 10 characters')
    .max(15, 'Phone number must be less than 15 characters'),
  businessEmail: z
    .string()
    .nonempty('Email is required')
    .email('Please enter a valid email address'),
  jobRole: z
    .string()
    .nonempty('Job role is required')
    .min(2, 'Job role must be at least 2 characters')
    .max(50, 'Job role must be less than 50 characters'),
  consent: z.boolean().refine((val) => val, {
    message: 'You must consent to the processing of your personal data',
  }),
  comments: z.string().max(500, 'Comments must be less than 500 characters').optional(),
})

type FormData = z.infer<typeof institutionsFormSchema>

type FormChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

interface FormFieldProps {
  label: string
  inputName: keyof FormData
  type: string
  value?: string | boolean
  placeholder?: string
  errors?: string[]
  disabled?: boolean
  textArea?: boolean
  textInput?: boolean
  checkbox?: boolean
  required?: boolean
  handleChange: (e: FormChangeEvent) => void
}

type InstitutionsContactFormValues = {
  companyName: string
  personalName?: string
  phoneNumber: string
  businessEmail: string
  jobRole: string
  comments?: string
  consent?: boolean
}

type InstitutionsContactFormErrors = {
  companyName: string[]
  personalName?: string[]
  phoneNumber: string[]
  businessEmail: string[]
  jobRole: string[]
  comments?: string[]
  global?: string[]
  consent?: string[]
}

const FormField: FC<FormFieldProps> = ({
  label,
  inputName,
  type,
  placeholder,
  handleChange,
  errors,
  value,
  disabled,
  textArea = false,
  checkbox = false,
  required = false,
}) => {
  const isTextField = !textArea && !checkbox
  const isCheckbox = checkbox && !textArea
  const isTextArea = textArea && !checkbox

  return (
    <div className={institutionsContactFormStyles.formField}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/** Special case for the checkbox which should be in line with the label */}
        {isCheckbox && (
          <ToggleButton
            checked={value as boolean}
            title=""
            id={inputName}
            onChange={handleChange}
            wrapperStyle={{
              marginRight: '8px',
              marginLeft: '-16px',
            }}
          />
        )}
        <label htmlFor={inputName}>
          <Text variant="p4semi" as="p" style={{ color: 'var(--earn-protocol-neutral-40)' }}>
            {label}{' '}
            {required && <span style={{ color: 'var(--earn-protocol-critical-100)' }}>*</span>}
          </Text>
        </label>
      </div>
      {isTextArea && (
        <textarea
          id={inputName}
          name={inputName}
          className={institutionsContactFormStyles.formInputTextarea}
          placeholder={placeholder}
          value={value as string}
          required
          onChange={handleChange}
          disabled={disabled}
          rows={4}
        />
      )}
      {isTextField && (
        <Input
          type={type}
          id={inputName}
          name={inputName}
          className={institutionsContactFormStyles.formInput}
          placeholder={placeholder}
          value={value as string}
          required
          onChange={handleChange}
          disabled={disabled}
        />
      )}
      <Text variant="p4semi" as="p" className={institutionsContactFormStyles.errorText}>
        {errors?.[0] ?? <>&nbsp;</>} {/* Display the first error message if any */}
      </Text>
    </div>
  )
}

export const InstitutionsContactForm = () => {
  const [formValues, setFormValues] = useState<InstitutionsContactFormValues>({
    companyName: '',
    personalName: '',
    phoneNumber: '',
    businessEmail: '',
    jobRole: '',
    comments: '',
    consent: false,
  })

  const [formErrors, setFormErrors] = useState<Partial<InstitutionsContactFormErrors>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleToggleChange = (field: keyof typeof formValues) => () => {
    // remove this field from errors
    setFormErrors((prev) => ({
      ...prev,
      [field]: [],
    }))

    setFormValues((prev) => ({
      ...prev,
      [field]: !prev[field], // Toggle the boolean value
    }))
  }

  const handleChange = (e: FormChangeEvent) => {
    const { name: key, value } = e.target

    // remove this field from errors
    setFormErrors((prev) => ({
      ...prev,
      [key]: [],
    }))

    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const resetForm = () => {
    setFormValues({
      companyName: '',
      personalName: '',
      phoneNumber: '',
      businessEmail: '',
      jobRole: '',
      comments: '',
      consent: false,
    })
    setFormErrors({})
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Reset errors
    setFormErrors({})
    // Validate form values
    const result = institutionsFormSchema.safeParse(formValues)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors

      setFormErrors(errors)
      setIsSubmitting(false)
    } else {
      const isDev = process.env.NODE_ENV !== 'production'
      const backendFormPath = '/earn/api/campaigns/institutions/form'
      let formEndpoint = ''

      if (isDev) {
        formEndpoint = `http://localhost:3002${backendFormPath}`
      } else {
        formEndpoint = `${window.location.origin}${backendFormPath}`
      }
      void handleCaptcha({
        formValues,
        formEndpoint,
        resetForm,
        setIsSubmitting,
        setIsSubmitted,
        setFormErrors,
      }).then((success) => {
        if (success) {
          // Reset form and show success message
          setTimeout(() => {
            setIsSubmitted(false)
          }, 5000) // Reset success message after 5 seconds
        } else {
          // Handle failure case
          setIsSubmitted(false)
        }
      })
    }
  }

  return (
    <Card className={institutionsContactFormStyles.cardStyles}>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />
      <Text variant="h3" as="h3">
        Want to learn more about Summer.fi&apos;s Self Managed Vaults?
      </Text>
      <div className={institutionsContactFormStyles.formDescription}>
        <Text variant="p2semi" as="p">
          Request more information:
        </Text>
        <Text variant="p3" as="span">
          Once you submit this form, an integration and DeFi specialist will reach out to you to
          discuss your specifications and questions.
        </Text>
      </div>
      <div>
        <FormField
          label="Company Name"
          inputName="companyName"
          type="text"
          placeholder="Crypto Corp LLC"
          value={formValues.companyName}
          handleChange={handleChange}
          errors={formErrors.companyName}
          disabled={isSubmitting}
          required
        />
        <FormField
          label="Personal Name"
          inputName="personalName"
          type="text"
          placeholder="John Doe"
          value={formValues.personalName}
          handleChange={handleChange}
          errors={formErrors.personalName}
          disabled={isSubmitting}
        />
        <FormField
          label="Phone Number"
          inputName="phoneNumber"
          type="tel"
          placeholder="+XX XXX XXX XXXX"
          value={formValues.phoneNumber}
          handleChange={handleChange}
          errors={formErrors.phoneNumber}
          disabled={isSubmitting}
          required
        />
        <FormField
          label="Business Email"
          inputName="businessEmail"
          type="email"
          placeholder="business@example.com"
          value={formValues.businessEmail}
          handleChange={handleChange}
          errors={formErrors.businessEmail}
          disabled={isSubmitting}
          required
        />
        <FormField
          label="Job Role"
          inputName="jobRole"
          type="text"
          placeholder="e.g. Head of Trading, Portfolio Manager"
          value={formValues.jobRole}
          handleChange={handleChange}
          errors={formErrors.jobRole}
          disabled={isSubmitting}
          required
        />
        <FormField
          label="Comments"
          inputName="comments"
          type="text"
          placeholder="Any additional information you want to share"
          value={formValues.comments}
          handleChange={handleChange}
          errors={formErrors.comments}
          disabled={isSubmitting}
          textArea
        />
        <FormField
          label="I consent to the processing of my personal data by OAZO APPS LIMITED collect through Getform for the purposes of receiving information about Summer.fi’s programmes, products and services."
          inputName="consent"
          type="checkbox"
          value={formValues.consent}
          handleChange={handleToggleChange('consent')}
          errors={formErrors.consent}
          disabled={isSubmitting}
          checkbox
          required
        />
      </div>
      <div>
        <AnimateHeight id="error-message" keepChildrenRendered show={!!formErrors.global}>
          <Text variant="p4semi" as="p" className={institutionsContactFormStyles.errorText}>
            {formErrors.global && formErrors.global.length > 0 ? formErrors.global[0] : ''}
          </Text>
        </AnimateHeight>
        <AnimateHeight id="success-message" keepChildrenRendered show={isSubmitted}>
          <Text variant="p2semi" as="p" className={institutionsContactFormStyles.successMessage}>
            {isSubmitted ? 'Thank you for your submission! We will get back to you soon.' : ''}
          </Text>
        </AnimateHeight>
      </div>
      <div className={institutionsContactFormStyles.formActions}>
        <Button variant="primaryLarge" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner size={14} /> : 'Submit'}
        </Button>
      </div>
      <div className={institutionsContactFormStyles.orContactusDirectly}>
        <Text variant="p2semi">
          or email us{' '}
          <Link
            href="mailto:institutions@summer.fi"
            style={{ color: 'var(--earn-protocol-primary-100)' }}
          >
            <Emphasis variant="p2semiColorful">@summer.fi</Emphasis>
          </Link>
        </Text>
      </div>
      <Text variant="p4" style={{ textAlign: 'center', color: 'var(--earn-protocol-neutral-60)' }}>
        This site is protected by reCAPTCHA and the Google{' '}
        <Link
          href="https://policies.google.com/privacy"
          target="_blank"
          style={{ color: 'var(--earn-protocol-neutral-40)' }}
        >
          Privacy Policy
        </Link>{' '}
        and{' '}
        <Link
          href="https://policies.google.com/terms"
          target="_blank"
          style={{ color: 'var(--earn-protocol-neutral-40)' }}
        >
          Terms of Service
        </Link>{' '}
        apply.
      </Text>
    </Card>
  )
}
