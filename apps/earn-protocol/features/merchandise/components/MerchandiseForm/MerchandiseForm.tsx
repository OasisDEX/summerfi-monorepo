'use client'
import { type ChangeEvent, type FC, useState } from 'react'
import { toast } from 'react-toastify'
import { useSignMessage, useSmartAccountClient } from '@account-kit/react'
import { Button, Input, Text } from '@summerfi/app-earn-ui'
import clsx from 'clsx'
import capitalize from 'lodash-es/capitalize'
import Link from 'next/link'

import { accountType } from '@/account-kit/config'
import { merchandiseFormValuesSchema } from '@/features/merchandise/helpers/form-schema'
import { getMerchandiseButtonLabel } from '@/features/merchandise/helpers/get-button-label'
import { getMerchandiseMessageToSign } from '@/features/merchandise/helpers/get-messageToSign'
import {
  type MerchandiseFormErrors,
  MerchandiseFormStatus,
  type MerchandiseFormValues,
  type MerchandiseType,
} from '@/features/merchandise/types'
import { PortfolioTabs } from '@/features/portfolio/types'
import { ERROR_TOAST_CONFIG, SUCCESS_TOAST_CONFIG } from '@/features/toastify/config'
import { useUserWallet } from '@/hooks/use-user-wallet'

import { merchandiseFormFields } from './fields'
import { areAllMerchandiseFormFieldsFilled } from './helpers'
import { merchandiseFormSizes } from './sizes'

import classNames from './MerchandiseForm.module.css'

interface FormFieldProps {
  label: string
  name: string
  type: string
  placeholder: string
  error?: string[]
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

const FormField: FC<FormFieldProps> = ({
  label,
  name,
  type,
  placeholder,
  handleChange,
  error,
  disabled,
}) => {
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
        disabled={disabled}
        inputWrapperStyles={{
          cursor: disabled ? 'not-allowed' : 'auto',
        }}
      />
      {error && (
        <Text variant="p3" as="p" style={{ color: 'var(--earn-protocol-critical-100)' }}>
          {error.join(', ')}
        </Text>
      )}
    </div>
  )
}

interface FormSelectProps {
  options: { label: string; value: string; icon: string; disabled?: boolean; hidden?: boolean }[]
  label: string
  name: string
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void
  value: string
  disabled?: boolean
}

const FormSelect: FC<FormSelectProps> = ({
  options,
  label,
  name,
  handleChange,
  value,
  disabled,
}) => {
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
        disabled={disabled}
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
  type: MerchandiseType
  walletAddress: string
}

export const MerchandiseForm: FC<MerchandiseFormProps> = ({ type, walletAddress }) => {
  const { client } = useSmartAccountClient({ type: accountType })
  const { signMessageAsync } = useSignMessage({
    client,
  })
  const { userWalletAddress } = useUserWallet()
  const [status, setStatus] = useState<MerchandiseFormStatus>(MerchandiseFormStatus.IDLE)
  const [formValues, setFormValues] = useState<MerchandiseFormValues>({
    name: '',
    email: '',
    address: '',
    country: '',
    zip: '',
    size: '',
  })

  const [errors, setErrors] = useState<MerchandiseFormErrors>({})

  const isOwner = walletAddress.toLowerCase() === userWalletAddress?.toLowerCase()

  const areAllFieldsFilled = areAllMerchandiseFormFieldsFilled(formValues)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validatedFormResult = merchandiseFormValuesSchema.safeParse(formValues)

    if (!validatedFormResult.success) {
      setErrors(validatedFormResult.error.flatten().fieldErrors)

      return
    }

    setErrors({})
    setStatus(MerchandiseFormStatus.LOADING)

    const messageToSign = getMerchandiseMessageToSign({
      walletAddress,
      type,
    })

    signMessageAsync({
      message: messageToSign,
    })
      .then((signature) => {
        fetch(`/earn/api/beach-club/merchandise/${walletAddress}/claim`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            signature,
            formValues,
            type,
          }),
        })
          .then((res) => {
            if (res.ok) {
              return res.json()
            }

            throw new Error('Response is not ok')
          })
          .then((data) => {
            if (data.error) {
              toast.error(data.error, ERROR_TOAST_CONFIG)
              setStatus(MerchandiseFormStatus.ERROR)

              return
            }

            toast.success(`${capitalize(type)} claimed successfully`, SUCCESS_TOAST_CONFIG)
            setStatus(MerchandiseFormStatus.SUCCESS)
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.log('Failed to claim merchandise', err)
            toast.error(
              'Failed to claim merchandise, please try again or contact with Summer support',
              ERROR_TOAST_CONFIG,
            )
            setStatus(MerchandiseFormStatus.ERROR)
          })
      })
      .catch((err) => {
        if (err.message.includes('User rejected the request')) {
          toast.error('User rejected the request', ERROR_TOAST_CONFIG)
          setStatus(MerchandiseFormStatus.ERROR)

          return
        }

        // eslint-disable-next-line no-console
        console.log('Unknown error occurred', err)
        toast.error(
          'Unknown error occurred, please try again or contact with Summer support',
          ERROR_TOAST_CONFIG,
        )
        setStatus(MerchandiseFormStatus.ERROR)
      })
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

  const inputsDisabled =
    status === MerchandiseFormStatus.LOADING || status === MerchandiseFormStatus.SUCCESS

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
          error={errors[field.name as keyof MerchandiseFormErrors]}
          disabled={inputsDisabled}
        />
      ))}
      <FormSelect
        options={merchandiseFormSizes}
        label="Size"
        name="size"
        handleChange={handleSelectChange}
        value={formValues.size}
        disabled={inputsDisabled}
      />
      <Button
        variant="beachClubLarge"
        type="submit"
        disabled={
          !areAllFieldsFilled ||
          !isOwner ||
          status === MerchandiseFormStatus.LOADING ||
          status === MerchandiseFormStatus.SUCCESS
        }
      >
        {getMerchandiseButtonLabel({ status, type })}
      </Button>
      {status === MerchandiseFormStatus.SUCCESS ? (
        <Link href={`/portfolio/${walletAddress}?tab=${PortfolioTabs.BEACH_CLUB}`}>
          <Text variant="p3" as="p" style={{ color: 'var(--beach-club-link)' }}>
            Go back to the Beach Club
          </Text>
        </Link>
      ) : (
        <div>
          <Text
            variant="p3"
            as="p"
            style={{ color: 'var(--earn-protocol-neutral-40)', textAlign: 'center' }}
          >
            We use{' '}
            <Link
              href="https://getform.io"
              target="_blank"
              rel="noreferrer"
              className={classNames.termsOfConditions}
            >
              GetForm
            </Link>{' '}
            to collect your data.
          </Text>
          <Text
            variant="p3"
            as="p"
            style={{ color: 'var(--earn-protocol-neutral-40)', textAlign: 'center' }}
          >
            Read the full{' '}
            <Link
              href="https://getform.io/legal/privacy-policy"
              className={classNames.termsOfConditions}
              target="_blank"
              rel="noreferrer"
            >
              terms of conditions.
            </Link>
          </Text>
        </div>
      )}
    </form>
  )
}
