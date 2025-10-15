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

import styles from '@/components/organisms/LoginPage/LoginPage.module.css'

export const LoginForm = ({
  email,
  isEmailValid,
  setEmail,
  password,
  isPasswordValid,
  setPassword,
  handleLoginSubmit,
  error,
  isLoadingLoginView,
  buttonDisabled,
}: {
  email: string
  isEmailValid: boolean
  setEmail: (value: string) => void
  password: string
  isPasswordValid: boolean
  setPassword: (value: string) => void
  handleLoginSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  error?: string
  isLoadingLoginView: boolean
  buttonDisabled: boolean
}) => {
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
