'use client'

import { type ChangeEvent, type FC, useState } from 'react'
import { Button, Card, Emphasis, Input, Text } from '@summerfi/app-earn-ui'
import { z } from 'zod'

import institutionsContactFormStyles from './InstitutionsContactForm.module.css'

const formSchema = z.object({
  companyName: z
    .string()
    .nonempty('Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  phoneNumber: z
    .string()
    .nonempty('Phone number is required')
    .min(10, 'Phone number must be at least 10 characters')
    .max(15, 'Phone number must be less than 15 characters'),
  businessEmail: z
    .string()
    .nonempty('Email is required')
    .email('Please enter a valid email address'),
})

type FormData = z.infer<typeof formSchema>

interface FormFieldProps {
  label: string
  inputName: keyof FormData
  type: string
  value?: string
  placeholder: string
  errors?: string[]
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const FormField: FC<FormFieldProps> = ({
  label,
  inputName,
  type,
  placeholder,
  handleChange,
  errors,
  value = '',
}) => {
  return (
    <div className={institutionsContactFormStyles.formField}>
      <label htmlFor={inputName}>
        <Text variant="p4semi" as="p" style={{ color: 'var(--earn-protocol-neutral-40)' }}>
          {label}
        </Text>
      </label>
      <Input
        type={type}
        id={inputName}
        name={inputName}
        className={institutionsContactFormStyles.formInput}
        placeholder={placeholder}
        value={value}
        required
        onChange={handleChange}
      />
      <Text variant="p4semi" as="p" className={institutionsContactFormStyles.errorText}>
        {errors?.[0] ?? <>&nbsp;</>} {/* Display the first error message if any */}
      </Text>
    </div>
  )
}

type InstitutionsContactFormValues = {
  companyName: string
  phoneNumber: string
  businessEmail: string
}

type InstitutionsContactFormErrors = {
  companyName: string[]
  phoneNumber: string[]
  businessEmail: string[]
}

export const InstitutionsContactForm = () => {
  const [formValues, setFormValues] = useState<InstitutionsContactFormValues>({
    companyName: '',
    phoneNumber: '',
    businessEmail: '',
  })

  const [formErrors, setFormErrors] = useState<Partial<InstitutionsContactFormErrors>>({})

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Reset errors
    setFormErrors({})
    // Validate form values
    const result = formSchema.safeParse(formValues)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors

      setFormErrors(errors)
    } else {
      // Handle successful form submission
      // eslint-disable-next-line no-console
      console.log('Form submitted successfully:', formValues)
      // Reset form values
      setFormValues({
        companyName: '',
        phoneNumber: '',
        businessEmail: '',
      })
    }
  }

  return (
    <Card className={institutionsContactFormStyles.cardStyles}>
      <Text variant="h3" as="h3">
        Ready to deploy capital into onchain
        <br />
        markets?
      </Text>
      <div className={institutionsContactFormStyles.formDescription}>
        <Text variant="p2semi" as="p">
          Schedule a call
        </Text>
        <Text variant="p3" as="span">
          Once you submit this form we will [NEEDS TO BE FILLED]
        </Text>
      </div>
      <FormField
        label="Company Name"
        inputName="companyName"
        type="text"
        placeholder="Crypto Corp LLC"
        value={formValues.companyName}
        handleChange={handleChange}
        errors={formErrors.companyName}
      />
      <FormField
        label="Phone Number"
        inputName="phoneNumber"
        type="tel"
        placeholder="+XX XXX XXX XXXX"
        value={formValues.phoneNumber}
        handleChange={handleChange}
        errors={formErrors.phoneNumber}
      />
      <FormField
        label="Business Email"
        inputName="businessEmail"
        type="email"
        placeholder="business@example.com"
        value={formValues.businessEmail}
        handleChange={handleChange}
        errors={formErrors.businessEmail}
      />
      <div className={institutionsContactFormStyles.formActions}>
        <Button variant="primaryLarge" onClick={handleSubmit}>
          Submit
        </Button>
        <Button
          variant="secondaryLarge"
          className={institutionsContactFormStyles.formActionsSecondaryButton}
        >
          Contact us
        </Button>
      </div>
      <div className={institutionsContactFormStyles.orContactusDirectly}>
        <Text variant="p2semi">
          or email us <Emphasis variant="p2semiColorful">@lazysummer.fi</Emphasis>
        </Text>
      </div>
    </Card>
  )
}
