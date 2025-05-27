'use client'
import { createContext, type FC, type ReactNode, useContext, useEffect, useState } from 'react'
import { type LandingPageData, type UserConfigResponse } from '@summerfi/app-types'

const LandingPageDataContext = createContext<Partial<{
  userConfig: UserConfigResponse
  landingPageData: LandingPageData
}> | null>(null)

export const LandingPageDataContextProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const [userConfig, setUserConfig] = useState<UserConfigResponse | undefined>(undefined)
  const [landingPageData, setLandingPageData] = useState<LandingPageData | undefined>(undefined)

  useEffect(() => {
    const apiUrl =
      process.env.NODE_ENV === 'development' ? `http://localhost:3002/earn/api` : `/earn/api`

    const fetchUserConfig = async () => {
      const response = await fetch(`${apiUrl}/user-config`)
      const data = await response.json()

      setUserConfig(data)
    }

    const fetchLandingPageData = async () => {
      const response = await fetch(`${apiUrl}/landing-page-data`)
      const data = await response.json()

      setLandingPageData(data)
    }

    fetchUserConfig()
    fetchLandingPageData()
  }, [])

  return (
    <LandingPageDataContext.Provider value={{ userConfig, landingPageData }}>
      {children}
    </LandingPageDataContext.Provider>
  )
}

export const useLandingPageData = () => {
  const landingPageData = useContext(LandingPageDataContext)

  return landingPageData ?? {}
}
