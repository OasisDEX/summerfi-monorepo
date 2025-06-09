import { type FC, useCallback, useEffect, useRef, useState } from 'react'
import { Icon, Input, LoadingSpinner, Text } from '@summerfi/app-earn-ui'

import styles from './BeachClubReferralForm.module.css'

interface BeachClubReferralFormProps {
  onError: (error: string | null) => void
  onChange: (value: string) => void
  refferalCodeFromCookie?: string
}

const isValidReferralCode = async (
  code: string,
): Promise<{ valid: boolean; customCode: string | null; referralCode: string | null }> => {
  try {
    const response = await fetch(`/earn/api/beach-club/validate-code/${code}`)

    const { valid, customCode, referralCode } = await response.json()

    return { valid, customCode, referralCode }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error validating referral code', error)

    return { valid: false, customCode: null, referralCode: null }
  }
}

export const BeachClubReferralForm: FC<BeachClubReferralFormProps> = ({
  onError,
  onChange,
  refferalCodeFromCookie,
}) => {
  const [value, setValue] = useState(refferalCodeFromCookie ?? '')
  const [isValid, setIsValid] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value

      setValue(newValue)
      onChange(newValue)
      setIsValid(false)
    },
    [onChange],
  )

  useEffect(() => {
    if (value === '') {
      onError(null)
      setIsValid(false)

      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setIsLoading(true)

      isValidReferralCode(value).then(({ valid, referralCode }) => {
        if (!valid) {
          onError('Incorrect code')
          setIsValid(false)
          onChange('')
        } else {
          onError(null)
          setIsValid(true)
          onChange(referralCode ?? '')
        }
        setIsLoading(false)
      })
    }, 400)

    // eslint-disable-next-line consistent-return
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      setIsValid(false)
      setIsLoading(false)
    }
  }, [value, onError])

  return (
    <div className={styles.beachClubReferralFormWrapper}>
      <Text as="p" variant="p4semi" style={{ color: 'var(--color-text-secondary)' }}>
        Earn more by using a referral code
      </Text>
      <div className={styles.inputWrapper}>
        <Input
          placeholder="Enter your referral code"
          style={{ width: '100%' }}
          variant="dark"
          value={value}
          onChange={handleChange}
        />
        {isValid && (
          <div className={styles.checkmarkIcon}>
            <Icon iconName="checkmark" size={20} color="var(--earn-protocol-success-100)" />
          </div>
        )}
        {isLoading && (
          <div className={styles.checkmarkIcon}>
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  )
}
