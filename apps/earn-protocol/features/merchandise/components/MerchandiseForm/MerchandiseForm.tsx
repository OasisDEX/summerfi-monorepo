'use client'
import { type ChangeEvent, type FC, useState } from 'react'
import { toast } from 'react-toastify'
import { useSignMessage, useSmartAccountClient } from '@account-kit/react'
import {
  Button,
  Dropdown,
  Icon,
  Input,
  INTERNAL_LINKS,
  LoadingSpinner,
  Text,
} from '@summerfi/app-earn-ui'
import { type DropdownRawOption } from '@summerfi/app-types'
import { handleCaptcha, RECAPTCHA_SITE_KEY } from '@summerfi/app-utils'
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

interface FormFieldProps {
  label: string
  name: string
  type: string
  placeholder: string
  value: string
  error?: string[]
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  // isOpen determines that the input is used as a dropdown
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
          // don't autocomplete if the input is used as a dropdown
          // to not interfere with custom options dropdown
          autoComplete={isBoolean(isOpen) ? 'off' : 'on'}
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
    })

    signMessageAsync({
      message: messageToSign,
    }).then(async (signature) => {
      const captchaInput = { formValues, signature, type }

      try {
        await handleCaptcha({
          formValues: captchaInput,
          formEndpoint: `/earn/api/beach-club/merchandise/${walletAddress}/claim`,
          resetForm: () => {},
          setIsSubmitting: (isSubmitting) => {
            if (isSubmitting) {
              setStatus(MerchandiseFormStatus.LOADING)
            }
          },
          setIsSubmitted: (isSubmitted) => {
            if (isSubmitted) {
              setStatus(MerchandiseFormStatus.SUCCESS)
              toast.success('Merchandise claimed successfully', SUCCESS_TOAST_CONFIG)
            }
          },
          setFormErrors: (errors) => {
            if (errors.global) {
              setStatus(MerchandiseFormStatus.ERROR)
              toast.error(errors.global.join(', '), ERROR_TOAST_CONFIG)
            }
          },
        })
      } catch (err) {
        setStatus(MerchandiseFormStatus.ERROR)
        toast.error('Unexpected error', ERROR_TOAST_CONFIG)
      }
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
        {status === MerchandiseFormStatus.LOADING && <LoadingSpinner size={24} />}
        {getMerchandiseButtonLabel({ status, type })}
      </Button>
      {status === MerchandiseFormStatus.SUCCESS ? (
        <Link href={`/portfolio/${walletAddress}?tab=${PortfolioTabs.BEACH_CLUB}`}>
          <Text variant="p3" as="p" style={{ color: 'var(--beach-club-link)' }}>
            Go back to the Beach Club
          </Text>
        </Link>
      ) : (
        <Text
          variant="p3"
          as="p"
          style={{ color: 'var(--earn-protocol-neutral-40)', textAlign: 'center' }}
        >
          Read the full{' '}
          <Link
            href={`${INTERNAL_LINKS.tempTerms}`}
            className={classNames.termsOfConditions}
            target="_blank"
            rel="noreferrer"
          >
            terms of conditions.
          </Link>
        </Text>
      )}
    </form>
  )
}
