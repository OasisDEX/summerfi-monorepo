'use client'
import { type ChangeEvent, type FC, useState } from 'react'
import { toast } from 'react-toastify'
import { useSignMessage, useSmartAccountClient } from '@account-kit/react'
import { Button, Dropdown, Icon, Input, RECAPTCHA_SITE_KEY, Text } from '@summerfi/app-earn-ui'
import { type DropdownRawOption } from '@summerfi/app-types'
import capitalize from 'lodash-es/capitalize'
import isBoolean from 'lodash-es/isBoolean'
import Link from 'next/link'
import Script from 'next/script'

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

declare global {
  const grecaptcha: {
    ready: (cb: () => void) => void
    execute: (siteKey: string, options: { action: string }) => Promise<string>
  }
}

interface FormFieldProps {
  label: string
  name: string
  type: string
  placeholder: string
  value: string
  error?: string[]
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  isOpen?: boolean
}

const FormField: FC<FormFieldProps> = ({
  label,
  name,
  type,
  placeholder,
  handleChange,
  value,
  error,
  disabled,
  isOpen,
}) => {
  return (
    <div className={classNames.formField}>
      <label htmlFor={name}>
        <Text variant="p4semi" as="p" style={{ color: 'var(--earn-protocol-neutral-40)' }}>
          {label}
        </Text>
      </label>
      <div style={{ position: 'relative' }}>
        <Input
          type={type}
          id={name}
          name={name}
          className={classNames.formInput}
          placeholder={placeholder}
          required
          onChange={handleChange}
          disabled={disabled}
          value={value}
          inputWrapperStyles={{
            cursor: disabled ? 'not-allowed' : isBoolean(isOpen) ? 'pointer' : 'auto',
            caretColor: isBoolean(isOpen) ? 'transparent' : 'var(--earn-protocol-neutral-40)',
          }}
        />
        {isBoolean(isOpen) && (
          <Icon
            iconName={isOpen ? 'chevron_up' : 'chevron_down'}
            size={13}
            style={{
              position: 'absolute',
              right: 'var(--general-space-8)',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            color="var(--earn-protocol-neutral-40)"
          />
        )}
      </div>
      {error && (
        <Text variant="p3" as="p" style={{ color: 'var(--earn-protocol-critical-100)' }}>
          {error.join(', ')}
        </Text>
      )}
    </div>
  )
}

interface DropdownTriggerProps {
  isDisabled?: boolean
  isOpen: boolean
  dropdownValue?: DropdownRawOption
}

const DropdownTrigger = ({ isOpen, isDisabled, dropdownValue }: DropdownTriggerProps) => {
  return (
    <FormField
      label="Size"
      name="size"
      type="select"
      placeholder="Size"
      handleChange={() => {}}
      disabled={isDisabled}
      value={dropdownValue?.value ?? ''}
      isOpen={isOpen}
    />
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
      .then(async (signature) => {
        let token

        try {
          token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' })
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log('Failed to get reCAPTCHA token', err)

          toast.error(
            'Failed to get reCAPTCHA token, please try again or contact with Summer support',
            ERROR_TOAST_CONFIG,
          )
          setStatus(MerchandiseFormStatus.ERROR)

          return
        }

        fetch(`/earn/api/beach-club/merchandise/${walletAddress}/claim`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            signature,
            formValues,
            type,
            token,
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

  const inputsDisabled =
    status === MerchandiseFormStatus.LOADING || status === MerchandiseFormStatus.SUCCESS

  return (
    <form className={classNames.merchandiseFormWrapper} onSubmit={onSubmit}>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />
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
          value={formValues[field.name as keyof MerchandiseFormValues]}
        />
      ))}
      <Dropdown
        options={merchandiseFormSizes.map((size) => ({
          label: size.label,
          value: size.value,
          content: size.label,
        }))}
        dropdownValue={{
          value: formValues.size,
          content: formValues.size,
        }}
        dropdownWrapperStyle={{ width: '100%' }}
        dropdownChildrenStyle={{ width: '100%' }}
        onChange={(option) => {
          setFormValues((prev) => ({
            ...prev,
            size: option.value,
          }))
        }}
        isDisabled={inputsDisabled}
        trigger={DropdownTrigger}
      >
        {null}
      </Dropdown>
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
