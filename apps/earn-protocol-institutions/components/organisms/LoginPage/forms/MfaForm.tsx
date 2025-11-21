import { Button, Input, LoadingSpinner, Text } from '@summerfi/app-earn-ui'

import styles from '@/components/organisms/LoginPage/LoginPage.module.css'

export const MfaForm = ({
  mfaCode,
  setMfaCode,
  handleRespondToSoftwareToken,
  error,
  isLoadingMfaView,
  mfaButtonDisabled,
  handleLoginReset,
}: {
  mfaCode: string
  setMfaCode: (value: string) => void
  handleRespondToSoftwareToken: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  error?: string
  isLoadingMfaView: boolean
  mfaButtonDisabled: boolean
  handleLoginReset: () => void
}) => {
  return (
    <div className={styles.container}>
      <Text variant="h1colorful">Two-factor authentication</Text>
      <Text variant="h4">Enter the 6-digit code from your authenticator app</Text>

      <form onSubmit={handleRespondToSoftwareToken} className={styles.form}>
        <div className={styles.fieldContainer}>
          <label htmlFor="mfaCode" className={styles.label}>
            Authentication Code
          </label>
          <Input
            variant="dark"
            type="text"
            id="mfaCode"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
            required
            maxLength={6}
            className={styles.mfaCodeInput}
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.mfaButtons}>
          <Button
            type="submit"
            disabled={mfaButtonDisabled}
            variant={mfaButtonDisabled ? 'secondaryMedium' : 'primaryMedium'}
            className={styles.button}
          >
            {isLoadingMfaView ? <LoadingSpinner size={14} /> : 'Verify'}
          </Button>
          <Button
            disabled={mfaButtonDisabled}
            onClick={(e) => {
              e.preventDefault()
              handleLoginReset()
            }}
            variant={mfaButtonDisabled ? 'textSecondarySmall' : 'textPrimarySmall'}
            className={styles.button}
          >
            Back to Login
          </Button>
        </div>
      </form>
    </div>
  )
}
