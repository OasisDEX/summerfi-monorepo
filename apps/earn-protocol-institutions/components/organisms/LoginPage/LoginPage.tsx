import {
  AnimateHeight,
  Button,
  Card,
  Icon,
  Input,
  LoadingSpinner,
  Text,
} from '@summerfi/app-earn-ui'
import clsx from 'clsx'

import { useLogin } from '@/hooks/useLogin'

import styles from './LoginPage.module.css'

export const LoginPage = () => {
  const {
    email,
    isEmailValid,
    setEmail,
    password,
    isPasswordValid,
    setPassword,
    newPassword,
    setNewPassword,
    newPasswordRequirements,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoadingChangePasswordView,
    isLoadingLoginView,
    handleLoginSubmit,
    handleSetNewPassword,
    challengeData,
  } = useLogin()

  if (challengeData?.challenge === 'NEW_PASSWORD_REQUIRED') {
    const buttonChallengeDisabled =
      isLoadingChangePasswordView || !newPasswordRequirements.allRequirementsMet

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

  const buttonDisabled = isLoadingLoginView || !email || !password

  return (
    <div className={styles.container}>
      <Text variant="h1colorful">Welcome</Text>

      <form onSubmit={handleLoginSubmit} className={styles.form}>
        <div className={styles.fieldContainer}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <div
            className={clsx(styles.inputWithValidationIcon, {
              [styles.inputWithValidationIconValidated]: isEmailValid,
            })}
          >
            <Input
              variant="dark"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              wrapperStyles={
                isEmailValid
                  ? {
                      border: '1px solid var(--color-text-success)',
                      borderRadius: '8px',
                    }
                  : {
                      border: '1px solid transparent',
                      borderRadius: '8px',
                    }
              }
            />
            <Icon iconName="checkmark" size={14} style={{ color: 'var(--color-text-success)' }} />
          </div>
        </div>

        <div className={styles.fieldContainer}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <div
            className={clsx(styles.inputWithValidationIcon, {
              [styles.inputWithValidationIconValidated]: isPasswordValid,
            })}
          >
            <Input
              variant="dark"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              wrapperStyles={
                isPasswordValid
                  ? {
                      border: '1px solid var(--color-text-success)',
                      borderRadius: '8px',
                    }
                  : {
                      border: '1px solid transparent',
                      borderRadius: '8px',
                    }
              }
            />
            <Icon iconName="checkmark" size={14} style={{ color: 'var(--color-text-success)' }} />
          </div>
        </div>
        <Button
          type="submit"
          disabled={buttonDisabled}
          variant={buttonDisabled ? 'secondaryMedium' : 'primaryMedium'}
          className={styles.button}
        >
          {isLoadingLoginView ? <LoadingSpinner size={14} /> : 'Sign In'}
        </Button>

        <AnimateHeight show={!!error} id="error-message">
          <Card variant="cardSecondarySmallPaddings" className={styles.errorCard}>
            <Text variant="p3" className={styles.errorText}>
              {error}
            </Text>
          </Card>
        </AnimateHeight>
      </form>
    </div>
  )
}
