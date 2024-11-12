'use client'
import { createContext, type FC, type ReactNode, useContext } from 'react'
import { type DeviceType } from '@summerfi/app-earn-ui'

const DeviceContext = createContext<DeviceType | null>(null)

export const DeviceProvider: FC<{ value: DeviceType; children: ReactNode }> = ({
  value,
  children,
}) => {
  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
}

export const useDeviceType = () => {
  const deviceType = useContext(DeviceContext)

  if (!deviceType) throw new Error('useDeviceType must be used within a DeviceProvider')

  return { deviceType }
}
