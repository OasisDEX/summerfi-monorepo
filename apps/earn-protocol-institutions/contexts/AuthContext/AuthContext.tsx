'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'

import type { AuthUser } from '@/types/auth'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const computeDelayMs = (exp: number, leadSec = 30) => {
  const nowSec = dayjs().unix()

  return Math.max((exp - nowSec - leadSec) * 1000, 0)
}

const fetchMe = async () => {
  const res = await fetch('/api/auth/me', { credentials: 'include' })

  if (!res.ok) {
    throw new Error(`me failed: ${res.status}`)
  }

  return res.json() as Promise<{ user: AuthUser; exp?: number }>
}

const refresh = async () => {
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  })

  return res.ok
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const refreshTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearRefreshTimer = () => {
    if (refreshTimeout.current) {
      clearTimeout(refreshTimeout.current)
      refreshTimeout.current = null
    }
  }

  // Self-rescheduling refresher: refresh -> fetchMe -> schedule next run
  const refreshAndReschedule = async () => {
    console.log('refreshAndReschedule')

    const ok = await refresh()

    if (!ok) {
      setUser(null)
      clearRefreshTimer()

      return
    }

    try {
      const data = await fetchMe()

      setUser(data.user)

      if (data.exp) {
        const delayMs = computeDelayMs(data.exp)

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

    const delayMs = computeDelayMs(exp)

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
      const data = await fetchMe()

      setUser(data.user)
      scheduleRefresh(data.exp)
    } catch {
      // Try refresh once on cold load
      const ok = await refresh()

      if (!ok) {
        setUser(null)
        clearRefreshTimer()

        return
      }
      try {
        const data2 = await fetchMe()

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

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))

      throw new Error(error.error || 'Sign in failed')
    }

    // Always reload from /me to get exp and schedule timer
    const data = await fetchMe()

    setUser(data.user)
    scheduleRefresh(data.exp)
  }

  const signOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST', credentials: 'include' })
    setUser(null)
    clearRefreshTimer()
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
