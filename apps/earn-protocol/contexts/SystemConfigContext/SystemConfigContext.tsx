'use client'
import { createContext, type FC, type ReactNode, useContext, useState } from 'react'
import { type EarnAppConfigType } from '@summerfi/app-types'

const SystemConfigContext = createContext<Partial<
  EarnAppConfigType & {
    runningGame: boolean
    setRunningGame: (running: boolean) => void
  }
> | null>(null)

export const SystemConfigProvider: FC<{
  value: Partial<EarnAppConfigType>
  children: ReactNode
}> = ({ value, children }) => {
  // used for the Yield Race game
  const [runningGame, setRunningGame] = useState(false)

  const contextValue = {
    ...value,
    runningGame,
    setRunningGame,
  }

  return (
    <SystemConfigContext.Provider value={contextValue}>{children}</SystemConfigContext.Provider>
  )
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
