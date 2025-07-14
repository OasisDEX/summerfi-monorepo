'use client'
import { type ChangeEvent, type FC, useState } from 'react'
import { Button, Input, INTERNAL_LINKS, Text } from '@summerfi/app-earn-ui'
import clsx from 'clsx'
import capitalize from 'lodash-es/capitalize'
import Link from 'next/link'

import { type MerchandiseFormValues } from '@/features/merchandise/types'

import { merchandiseFormFields } from './fields'
import { areAllMerchandiseFormFieldsFilled } from './helpers'
import { merchandiseFormSizes } from './sizes'

import classNames from './MerchandiseForm.module.css'

interface FormFieldProps {
  label: string
  name: string
  type: string
  placeholder: string
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const FormField: FC<FormFieldProps> = ({ label, name, type, placeholder, handleChange }) => {
  return (
    <div className={classNames.formField}>
      <label htmlFor={name}>
        <Text variant="p4semi" as="p" style={{ color: 'var(--earn-protocol-neutral-40)' }}>
          {label}
        </Text>
      </label>
      <Input
        type={type}
        id={name}
        name={name}
        className={classNames.formInput}
        placeholder={placeholder}
        required
        onChange={handleChange}
      />
    </div>
  )
}

interface FormSelectProps {
  options: { label: string; value: string; icon: string; disabled?: boolean; hidden?: boolean }[]
  label: string
  name: string
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void
  value: string
}

const FormSelect: FC<FormSelectProps> = ({ options, label, name, handleChange, value }) => {
  return (
    <div className={classNames.formSelectWrapper}>
      <label htmlFor={name}>
        <Text variant="p4semi" as="p" style={{ color: 'var(--earn-protocol-neutral-40)' }}>
          {label}
        </Text>
      </label>
      <select
        name={name}
        id={name}
        className={clsx(classNames.formSelect)}
        required
        onChange={handleChange}
        value={value}
        style={{
          color:
            value === '' ? 'var(--earn-protocol-neutral-40)' : 'var(--earn-protocol-secondary-100)',
        }}
      >
        {options.map((size) => (
          <option key={size.value} value={size.value} disabled={size.disabled} hidden={size.hidden}>
            {size.label}
          </option>
        ))}
      </select>
    </div>
  )
}

interface MerchandiseFormProps {
  type: string
}

export const MerchandiseForm: FC<MerchandiseFormProps> = ({ type }) => {
  const [formValues, setFormValues] = useState<MerchandiseFormValues>({
    name: '',
    email: '',
    address: '',
    country: '',
    zip: '',
    size: '',
  })

  const areAllFieldsFilled = areAllMerchandiseFormFieldsFilled(formValues)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // eslint-disable-next-line no-console
    console.log('submit', formValues)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <form className={classNames.merchandiseFormWrapper} onSubmit={onSubmit}>
      {merchandiseFormFields.map((field) => (
        <FormField
          key={field.name}
          label={field.label}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          handleChange={handleChange}
        />
      ))}
      <FormSelect
        options={merchandiseFormSizes}
        label="Size"
        name="size"
        handleChange={handleSelectChange}
        value={formValues.size}
      />
      <Button variant="beachClubLarge" type="submit" disabled={!areAllFieldsFilled}>
        Claim {capitalize(type)}
      </Button>
      <Text variant="p3" as="p" style={{ color: 'var(--earn-protocol-neutral-40)' }}>
        Read the full{' '}
        <Link
          href={INTERNAL_LINKS.tempTerms}
          className={classNames.termsOfConditions}
          target="_blank"
        >
          terms of conditions
        </Link>
      </Text>
    </form>
  )
}
