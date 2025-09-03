import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { useAuth } from '@/contexts/AuthContext/AuthContext'

export const useLogin = () => {
  const urlQueryParams = useSearchParams()
  const isUnauthorized = urlQueryParams.get('error') === 'unauthorized'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(isUnauthorized ? 'Unauthorized access.' : '')
  const [isLoadingLoginView, setIsLoadingLoginView] = useState(false)
  const [isLoadingChangePasswordView, setIsLoadingChangePasswordView] = useState(false)

  const { signIn, challengeData, setChallengeData } = useAuth()

  const handleSetEmail = (nextEmail: string) => {
    setError('')
    setEmail(nextEmail)
  }

  const handleSetPassword = (nextPassword: string) => {
    setError('')
    setPassword(nextPassword)
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoadingLoginView(true)
    try {
      await signIn(email, password)
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
      // Redirect or update UI here
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password change failed')
    } finally {
      setIsLoadingChangePasswordView(false)
    }
  }

  return {
    email,
    setEmail: handleSetEmail,
    password,
    setPassword: handleSetPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoadingLoginView,
    isLoadingChangePasswordView,
    handleLoginSubmit,
    handleSetNewPassword,
    challengeData,
  }
}
