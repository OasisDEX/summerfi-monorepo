'use client'
import { createContext, type FC, type ReactNode, useContext } from 'react'
import { type EarnAppConfigType } from '@summerfi/app-types'

const SystemConfigContext = createContext<Partial<EarnAppConfigType> | null>(null)

export const SystemConfigProvider: FC<{
  value: Partial<EarnAppConfigType>
  children: ReactNode
}> = ({ value, children }) => {
  return <SystemConfigContext.Provider value={value}>{children}</SystemConfigContext.Provider>
}

/**
 * Hook to access the system configuration context
 * @returns Partial<EarnAppConfigType> - The system configuration object, or an empty object if context is not available
 */

export const useSystemConfig = () => {
  const systemConfig = useContext(SystemConfigContext)

  // if systemConfig is not defined for unknow reason intialize as an empty object
  // since context value is wrapped in partial it forces us to do checks before using
  // value from config
  return systemConfig ?? {}
}
