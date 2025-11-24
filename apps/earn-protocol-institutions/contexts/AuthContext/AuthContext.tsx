'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { authComputeDelayMs, authFetchMe, authRefresh } from '@/contexts/AuthContext/helpers'
import { type ChallengeResponse, type SignInResponse } from '@/features/auth/types'

interface AuthContextType {
  user: SignInResponse['user'] | null
  isLoading: boolean
  challengeData: { challenge: string; session: string; email: string } | null
  setChallengeData: React.Dispatch<
    React.SetStateAction<{ challenge: string; session: string; email: string } | null>
  >
  authSignInHandler: (email: string, password: string) => Promise<SignInResponse | null>
  authSignOutHandler: () => Promise<void>
  authSetPasswordHandler: (params: { newPassword: string }) => Promise<SignInResponse | null>
  authRespondToMfaHandler: (code: string) => Promise<SignInResponse | null>
  handleAuthReset: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SignInResponse['user'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [challengeData, setChallengeData] = useState<{
    // setting new password
    challenge: string
    session: string
    email: string
  } | null>(null)
  const refreshTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { replace } = useRouter()

  const clearRefreshTimer = () => {
    if (refreshTimeout.current) {
      clearTimeout(refreshTimeout.current)
      refreshTimeout.current = null
    }
  }
  const handleAuthReset = () => {
    setUser(null)
    clearRefreshTimer()
    setChallengeData(null)
    setIsLoading(false)
  }

  // Self-rescheduling refresher: refresh -> fetchMe -> schedule next run
  const refreshAndReschedule = async () => {
    const ok = await authRefresh()

    if (!ok) {
      setUser(null)
      clearRefreshTimer()

      return
    }

    try {
      const data = await authFetchMe()

      setUser(data.user)

      if (data.exp) {
        const delayMs = authComputeDelayMs(data.exp)

        clearRefreshTimer()
        if (delayMs === 0) {
          await refreshAndReschedule()
        } else {
          refreshTimeout.current = setTimeout(() => {
            void refreshAndReschedule()
          }, delayMs)
        }
      }
    } catch {
      setUser(null)
      clearRefreshTimer()
    }
  }

  const scheduleRefresh = (exp?: number) => {
    clearRefreshTimer()
    if (!exp) return

    const delayMs = authComputeDelayMs(exp)

    if (delayMs === 0) {
      void refreshAndReschedule()

      return
    }

    refreshTimeout.current = setTimeout(() => {
      void refreshAndReschedule()
    }, delayMs)
  }

  const checkAuth = async () => {
    try {
      const data = await authFetchMe()

      setUser(data.user)
      scheduleRefresh(data.exp)
    } catch {
      // Try refresh once on cold load
      const ok = await authRefresh()

      if (!ok) {
        setUser(null)
        clearRefreshTimer()

        return
      }
      try {
        const data2 = await authFetchMe()

        setUser(data2.user)
        scheduleRefresh(data2.exp)
      } catch {
        setUser(null)
        clearRefreshTimer()
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void checkAuth()

    return () => clearRefreshTimer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const authSignInHandler = async (email: string, password: string) => {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })

    const data = (await response.json()) as
      | SignInResponse
      | ChallengeResponse
      | {
          error: string
        }

    if (!response.ok) {
      throw new Error('error' in data ? data.error : 'Sign in failed')
    }

    if (
      'challenge' in data &&
      'email' in data &&
      data.session &&
      data.email &&
      typeof data.email === 'string'
    ) {
      // Store challenge data so the UI can render the appropriate challenge form
      // This covers NEW_PASSWORD_REQUIRED and SOFTWARE_TOKEN_MFA (and others if needed)
      setChallengeData({
        challenge: data.challenge ?? '',
        session: data.session,
        email: data.email,
      })

      return null
    }

    if (!('user' in data) || !data.user) {
      throw new Error('No user data returned after sign in.')
    }

    setUser(data.user)
    setChallengeData(null)

    return data
  }

  const authSignOutHandler = async () => {
    await fetch('/api/auth/signout', { method: 'POST', credentials: 'include' })

    setUser(null)
    clearRefreshTimer()
    replace('/')
  }

  const authSetPasswordHandler = async ({ newPassword }: { newPassword: string }) => {
    if (!challengeData) {
      throw new Error('No challenge data available')
    }
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
      // eslint-disable-next-line no-console
      console.error('Password change failed', data)

      return null
    }
    setUser(data.user)
    setChallengeData(null)

    return data
  }

  const authRespondToMfaHandler = async (code: string) => {
    if (!challengeData) {
      throw new Error('No challenge data available')
    }

    const response = await fetch('/api/auth/respond-challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: challengeData.email,
        session: challengeData.session,
        code,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'MFA verification failed')
    }
    setUser(data.user)
    setChallengeData(null)

    return data
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        authSignInHandler,
        authSignOutHandler,
        authRespondToMfaHandler,
        challengeData,
        setChallengeData,
        authSetPasswordHandler,
        handleAuthReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider')
  }

  return context
}
