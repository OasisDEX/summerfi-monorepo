import { type FC, useCallback, useEffect, useRef, useState } from 'react'
import { Icon, Input, LoadingSpinner, Text } from '@summerfi/app-earn-ui'

import styles from './BeachClubReferralForm.module.css'

interface BeachClubReferralFormProps {
  onError: (error: string | null) => void
  onChange: (value: string) => void
}

// TO BE REPLACED WITH THE REAL API CALL
const mockCheckReferralCode = (_code: string): Promise<{ isCorrectCode: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ isCorrectCode: true })
    }, 500)
  })
}

export const BeachClubReferralForm: FC<BeachClubReferralFormProps> = ({ onError, onChange }) => {
  const [value, setValue] = useState('')
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
      mockCheckReferralCode(value).then(({ isCorrectCode }) => {
        if (!isCorrectCode) {
          onError('Incorrect code')
          setIsValid(false)
        } else {
          onError(null)
          setIsValid(true)
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
