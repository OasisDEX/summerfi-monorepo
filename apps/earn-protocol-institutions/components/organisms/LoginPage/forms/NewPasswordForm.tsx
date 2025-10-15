import { Button, Icon, Input, Text } from '@summerfi/app-earn-ui'

import styles from '@/components/organisms/LoginPage/LoginPage.module.css'

export const NewPasswordForm = ({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  newPasswordRequirements,
  handleSetNewPassword,
  error,
  isLoadingChangePasswordView,
  buttonChallengeDisabled,
}: {
  newPassword: string
  setNewPassword: (value: string) => void
  confirmPassword: string
  setConfirmPassword: (value: string) => void
  newPasswordRequirements: {
    length: boolean
    hasNumber: boolean
    hasSpecialCharacter: boolean
    hasUppercase: boolean
    hasLowercase: boolean
    isTheSame: boolean
  }
  handleSetNewPassword: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  error?: string
  isLoadingChangePasswordView: boolean
  buttonChallengeDisabled: boolean
}) => {
  return (
    <div className={styles.container}>
      <Text variant="h1colorful">Set New Password</Text>
      <Text variant="h4">Last step before you see the dashboard</Text>

      <form onSubmit={handleSetNewPassword} className={styles.form}>
        <div className={styles.fieldContainer}>
          <label htmlFor="newPassword" className={styles.label}>
            New Password
          </label>
          <Input
            variant="dark"
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles.fieldContainer}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm Password
          </label>
          <Input
            variant="dark"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles.newPasswordRequirements}>
          <Text variant="p3semi">Password requirements</Text>
          <ul>
            <li>
              <Icon
                iconName="checkmark"
                style={{
                  color: newPasswordRequirements.length
                    ? 'var(--color-text-success)'
                    : 'var(--earn-protocol-neutral-40)',
                }}
                size={14}
              />
              <Text
                variant="p4"
                style={{
                  color: newPasswordRequirements.length
                    ? 'var(--color-text-success)'
                    : 'var(--earn-protocol-neutral-40)',
                }}
              >
                At least 8 characters long
              </Text>
            </li>
            <li>
              <Icon
                iconName="checkmark"
                style={{
                  color: newPasswordRequirements.hasNumber
                    ? 'var(--color-text-success)'
                    : 'var(--earn-protocol-neutral-40)',
                }}
                size={14}
              />
              <Text
                variant="p4"
                style={{
                  color: newPasswordRequirements.hasNumber
                    ? 'var(--color-text-success)'
                    : 'var(--earn-protocol-neutral-40)',
                }}
              >
                Contains at least 1 number
              </Text>
            </li>
            <li>
              <Icon
                iconName="checkmark"
                style={{
                  color: newPasswordRequirements.hasSpecialCharacter
                    ? 'var(--color-text-success)'
                    : 'var(--earn-protocol-neutral-40)',
                }}
                size={14}
              />
              <Text
                variant="p4"
                style={{
                  color: newPasswordRequirements.hasSpecialCharacter
                    ? 'var(--color-text-success)'
                    : 'var(--earn-protocol-neutral-40)',
                }}
              >
                Contains at least 1 special character
              </Text>
            </li>
            <li>
              <Icon
                iconName="checkmark"
                style={{
                  color: newPasswordRequirements.hasUppercase
                    ? 'var(--color-text-success)'
                    : 'var(--earn-protocol-neutral-40)',
                }}
                size={14}
              />
              <Text
                variant="p4"
                style={{
                  color: newPasswordRequirements.hasUppercase
                    ? 'var(--color-text-success)'
                    : 'var(--earn-protocol-neutral-40)',
                }}
              >
                Contains at least 1 uppercase letter
              </Text>
            </li>
            <li>
              <Icon
                iconName="checkmark"
                style={{
                  color: newPasswordRequirements.hasLowercase
                    ? 'var(--color-text-success)'
                    : 'var(--earn-protocol-neutral-40)',
                }}
                size={14}
              />
              <Text
                variant="p4"
                style={{
                  color: newPasswordRequirements.hasLowercase
                    ? 'var(--color-text-success)'
                    : 'var(--earn-protocol-neutral-40)',
                }}
              >
                Contains at least 1 lowercase letter
              </Text>
            </li>
            <li>
              <Icon
                iconName="checkmark"
                style={{
                  color: newPasswordRequirements.isTheSame
                    ? 'var(--color-text-success)'
                    : 'var(--earn-protocol-neutral-40)',
                }}
                size={14}
              />
              <Text
                variant="p4"
                style={{
                  color: newPasswordRequirements.isTheSame
                    ? 'var(--color-text-success)'
                    : 'var(--earn-protocol-neutral-40)',
                }}
              >
                Both passwords match
              </Text>
            </li>
          </ul>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <Button
          type="submit"
          disabled={buttonChallengeDisabled}
          variant={buttonChallengeDisabled ? 'secondaryMedium' : 'primaryMedium'}
          className={styles.button}
        >
          {isLoadingChangePasswordView ? 'Setting Password...' : 'Set New Password'}
        </Button>
      </form>
    </div>
  )
}
