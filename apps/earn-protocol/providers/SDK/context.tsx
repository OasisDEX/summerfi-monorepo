'use client'

import { createContext, useContext } from 'react'
import { type IEarnProtocolFleetClient, type UserClient } from '@summerfi/sdk-client'
import { type Token } from '@summerfi/sdk-common'

export type SDKContextType = {
  getFleetClient: ({
    chainId,
    fleetAddress,
  }: {
    chainId: number
    fleetAddress: string
  }) => Promise<IEarnProtocolFleetClient>
  getTokenBySymbol: ({ chainId, symbol }: { chainId: number; symbol: string }) => Promise<Token>
  getUserClient: ({
    chainId,
    walletAddress,
  }: {
    chainId: number
    walletAddress: string
  }) => Promise<UserClient>
}

export const SDKContext = createContext<SDKContextType | null>(null)

export const useSDK = () => {
  const context = useContext(SDKContext)

  if (!context) {
    throw new Error('useSDK must be used within a SDKProvider')
  }

  return context
}
