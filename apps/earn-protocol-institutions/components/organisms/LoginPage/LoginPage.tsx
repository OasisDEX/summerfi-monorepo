import { Text } from '@summerfi/app-earn-ui'

import { LoginForm } from '@/components/organisms/LoginPage/forms/LoginForm'
import { MfaForm } from '@/components/organisms/LoginPage/forms/MfaForm'
import { NewPasswordForm } from '@/components/organisms/LoginPage/forms/NewPasswordForm'
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
    // MFA
    mfaCode,
    setMfaCode,
    isLoadingMfaView,
    handleRespondToSoftwareToken,
    challengeData,
    successfulLogin,
  } = useLogin()

  if (successfulLogin) {
    return (
      <div className={styles.container}>
        <Text variant="h1colorful">Login Successful</Text>
        <Text variant="h4">Redirecting to your dashboard...</Text>
      </div>
    )
  }

  if (challengeData?.challenge === 'NEW_PASSWORD_REQUIRED') {
    return (
      <NewPasswordForm
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        newPasswordRequirements={newPasswordRequirements}
        handleSetNewPassword={handleSetNewPassword}
        error={error}
        isLoadingChangePasswordView={isLoadingChangePasswordView}
        buttonChallengeDisabled={
          isLoadingChangePasswordView || !newPasswordRequirements.allRequirementsMet
        }
      />
    )
  }

  if (challengeData?.challenge === 'SOFTWARE_TOKEN_MFA') {
    return (
      <MfaForm
        mfaCode={mfaCode}
        setMfaCode={setMfaCode}
        handleRespondToSoftwareToken={handleRespondToSoftwareToken}
        error={error}
        isLoadingMfaView={isLoadingMfaView}
        mfaButtonDisabled={isLoadingMfaView || !challengeData}
      />
    )
  }

  return (
    <LoginForm
      email={email}
      isEmailValid={isEmailValid}
      setEmail={setEmail}
      password={password}
      isPasswordValid={isPasswordValid}
      setPassword={setPassword}
      handleLoginSubmit={handleLoginSubmit}
      error={error}
      isLoadingLoginView={isLoadingLoginView}
      buttonDisabled={isLoadingLoginView || !email || !password}
    />
  )
}
