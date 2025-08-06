'use client'

import { createContext, useContext, useEffect, useState } from 'react'

import type { AuthUser } from '@/types/auth'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')

      if (response.ok) {
        const userData = await response.json()

        setUser(userData.user)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()

      throw new Error(error.error || 'Sign in failed')
    }

    const data = await response.json()

    setUser(data.user)
  }

  const signOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    setUser(null)
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
