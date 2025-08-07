'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { SignInResponse } from '@/types/auth'

interface UserDataContextType {
  user: SignInResponse | null
  isLoading: boolean
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined)

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SignInResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { replace } = useRouter()

  const getUser = async () => {
    try {
      const response = await fetch('/api/auth/get-user-data')

      if (response.ok) {
        const userData = await response.json()

        setUser(userData.user)
      } else {
        const errorData = await response.json()

        throw new Error(errorData.error || 'Failed to fetch user data')
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('User check failed:', error)
      await fetch('/api/auth/signout')
        .then(() => {
          // Clear cookies and redirect to sign-in page
          replace('/')
        })
        .catch((signOutError) => {
          // eslint-disable-next-line no-console
          console.error('Sign out failed:', signOutError)
          // Optionally, you can redirect to an error page or show a notification
        })
        .finally(() => {
          setUser(null)
          replace('/')
        })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <UserDataContext.Provider value={{ user, isLoading }}>{children}</UserDataContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserDataContext)

  if (context === undefined) {
    throw new Error('useUser must be used within an UserDataProvider')
  }

  return context
}
