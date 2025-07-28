'use client'
import { createContext, type FC, type ReactNode, useContext } from 'react'
import { DeviceType } from '@summerfi/app-types'

const DeviceContext = createContext<DeviceType | null>(null)

export const DeviceProvider: FC<{ value: DeviceType; children: ReactNode }> = ({
  value,
  children,
}) => {
  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
}

export const useDeviceType = () => {
  const deviceType = useContext(DeviceContext)

  // A default initial value needed for SSR render, since rendering
  // doesn't wait for all async calls to resolve
  return { deviceType: deviceType ?? DeviceType.DESKTOP }
}
