import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { useAuth } from '@/contexts/AuthContext/AuthContext'
import { authFetchMe } from '@/contexts/AuthContext/helpers'
import { type SignInResponse } from '@/features/auth/types'

const passwordMeetsRequirements = (password: string) => {
  // Password minimum length
  // 8 character(s)
  // Password requirements
  // Contains at least 1 number
  // Contains at least 1 special character (^$*.[]{}()?-"!@#%&/\,><':;|_~`+=)
  // Contains at least 1 uppercase letter
  // Contains at least 1 lowercase letter
  return (
    password.length >= 8 &&
    /[0-9]/u.test(password) &&
    /[\^$*.-[\]{}(?)"!@#%&/\\,><':;|_~`+=]/u.test(password) &&
    /[A-Z]/u.test(password) &&
    /[a-z]/u.test(password)
  )
}

const passwordMeetsRequirementsDetailed = (password: string, confirmedPassword: string) => {
  // Password minimum length
  // 8 character(s)
  // Password requirements
  // Contains at least 1 number
  // Contains at least 1 special character (^$*.[]{}()?-"!@#%&/\,><':;|_~`+=)
  // Contains at least 1 uppercase letter
  // Contains at least 1 lowercase letter
  return {
    length: password.length >= 8,
    hasNumber: /[0-9]/u.test(password),
    hasSpecialCharacter: /[\^$*.-[\]{}(?)"!@#%&/\\,><':;|_~`+=]/u.test(password),
    hasUppercase: /[A-Z]/u.test(password),
    hasLowercase: /[a-z]/u.test(password),
    isTheSame: password.length >= 8 && password === confirmedPassword,
    allRequirementsMet: passwordMeetsRequirements(password) && password === confirmedPassword,
  }
}

export const useLogin = () => {
  const urlQueryParams = useSearchParams()
  const isUnauthorized = urlQueryParams.get('error') === 'unauthorized'
  const [successfulLogin, setSuccessfulLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [password, setPassword] = useState('')
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(isUnauthorized ? 'Unauthorized access.' : '')
  const [isLoadingLoginView, setIsLoadingLoginView] = useState(false)
  const [isLoadingChangePasswordView, setIsLoadingChangePasswordView] = useState(false)

  const { signIn, challengeData, setChallengeData } = useAuth()

  const [mfaCode, setMfaCode] = useState('')
  const [isLoadingMfaView, setIsLoadingMfaView] = useState(false)
  const { replace } = useRouter()

  const handleRedirect = (userData: SignInResponse['user']) => {
    // Redirection logic
    if (userData?.isGlobalAdmin) {
      replace('/admin/institutions')
    } else if (userData?.institutionsList?.[0]?.name) {
      replace(`${userData.institutionsList[0].name}/overview/institution`)
    } else {
      // eslint-disable-next-line no-console
      console.log('No valid redirection path found for the user.')
    }
  }

  const handleSetEmail = (nextEmail: string) => {
    setError('')
    setEmail(nextEmail)
    setIsEmailValid(!!nextEmail && /^\S+@\S+\.\S+$/u.test(nextEmail))
  }

  const handleSetPassword = (nextPassword: string) => {
    setError('')
    setPassword(nextPassword)
    setIsPasswordValid(passwordMeetsRequirements(nextPassword))
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoadingLoginView(true)
    try {
      const signInComplete = await signIn(email, password)

      if (!signInComplete) {
        // If there's a challenge, we don't proceed to fetch user data yet
        return
      }
      const me = await authFetchMe()

      if (me.user) {
        setSuccessfulLogin(true)
        handleRedirect(me.user)
      } else {
        // eslint-disable-next-line no-console
        console.log('No user data returned after sign in.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
      setIsLoadingLoginView(false)
    }
    // don't set isLoading to false in finally to avoid button flickering before redirect
  }

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')

      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')

      return
    }

    setIsLoadingChangePasswordView(true)

    if (!challengeData) {
      setError('No challenge data available')
      setIsLoadingChangePasswordView(false)

      return
    }

    try {
      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: challengeData.email,
          newPassword,
          session: challengeData.session,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Password change failed')
      }
      setChallengeData(null)
      setSuccessfulLogin(true)
      handleRedirect(data.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password change failed')
    } finally {
      setIsLoadingChangePasswordView(false)
    }
  }

  const handleRespondToSoftwareToken = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!challengeData) {
      setError('No challenge data available')

      return
    }

    if (!mfaCode || mfaCode.length < 6) {
      setError('Enter a valid 6 digit code')

      return
    }

    setIsLoadingMfaView(true)

    try {
      const response = await fetch('/api/auth/respond-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: challengeData.email,
          session: challengeData.session,
          code: mfaCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'MFA verification failed')
      }

      // Clear challenge data on success
      setChallengeData(null)
      setSuccessfulLogin(true)
      handleRedirect(data.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'MFA verification failed')
    } finally {
      setIsLoadingMfaView(false)
    }
  }

  return {
    email,
    isEmailValid,
    setEmail: handleSetEmail,
    password,
    isPasswordValid,
    setPassword: handleSetPassword,
    newPassword,
    setNewPassword,
    newPasswordRequirements: passwordMeetsRequirementsDetailed(newPassword, confirmPassword),
    confirmPassword,
    setConfirmPassword,
    error,
    isLoadingLoginView,
    isLoadingChangePasswordView,
    handleLoginSubmit,
    handleSetNewPassword,
    // MFA challenge handling
    mfaCode,
    setMfaCode,
    isLoadingMfaView,
    handleRespondToSoftwareToken,
    challengeData,
    successfulLogin,
  }
}
