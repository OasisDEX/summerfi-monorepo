'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { authComputeDelayMs, authFetchMe, authRefresh } from '@/contexts/AuthContext/helpers'
import { type ChallengeResponse, type SignInResponse } from '@/features/auth/types'

interface AuthContextType {
  user: SignInResponse['user'] | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  challengeData: { challenge: string; session: string; email: string } | null
  setChallengeData: React.Dispatch<
    React.SetStateAction<{ challenge: string; session: string; email: string } | null>
  >
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

  const signIn = async (email: string, password: string) => {
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
      data.challenge === 'NEW_PASSWORD_REQUIRED' &&
      data.session &&
      data.email &&
      typeof data.email === 'string'
    ) {
      // Store challenge data so the UI can render the new password form
      setChallengeData({ challenge: data.challenge, session: data.session, email: data.email })

      return
    }

    // Normal successful sign in -> fetch /me to set user and schedule token refresh
    const me = await authFetchMe()

    if (!me.user) {
      throw new Error('User not found')
    }

    setUser(me.user)
    scheduleRefresh(me.exp)

    // Redirection logic
    if (me.user.isGlobalAdmin) {
      replace('/admin/institutions')
    } else if (me.user.institutionsList?.[0]?.name) {
      replace(`${me.user.institutionsList[0].name}/overview`)
    }
  }

  const signOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST', credentials: 'include' })
    setUser(null)
    clearRefreshTimer()
    replace('/')
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signIn, signOut, challengeData, setChallengeData }}
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
