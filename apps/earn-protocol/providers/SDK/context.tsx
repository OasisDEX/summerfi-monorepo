import React, { createContext, type PropsWithChildren, useContext } from 'react'
import { type IEarnProtocolFleetClient, makeSDK, type UserClient } from '@summerfi/sdk-client'
import { Address, type Token } from '@summerfi/sdk-common'

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

const SDKContext = createContext<SDKContextType | null>(null)

type Props = {
  //
}

const sdkApiUrl = '/api/sdk'

export const SDKProvider = ({ children }: PropsWithChildren<Props>) => {
  const sdk = makeSDK({
    apiURL: sdkApiUrl,
  })

  const getUserClient = async ({
    chainId,
    walletAddress,
  }: {
    chainId: number
    walletAddress: string
  }) => {
    const chain = await sdk.chains.getChainById({
      chainId,
    })

    if (!chain) {
      throw new Error('Chain not found')
    }
    const user = await sdk.users.getUser({
      chainInfo: chain.chainInfo,
      walletAddress: Address.createFromEthereum({ value: walletAddress }),
    })

    return user
  }

  const getFleetClient = async ({
    chainId,
    fleetAddress,
  }: {
    chainId: number
    fleetAddress: string
  }) => {
    const chain = await sdk.chains.getChainById({
      chainId,
    })

    if (!chain) {
      throw new Error('Chain not found')
    }
    const fleet = chain.earnProtocol.getFleet({
      address: Address.createFromEthereum({ value: fleetAddress }),
    })

    if (!fleet) {
      throw new Error(`SDK: Fleet not found: ${fleetAddress}`)
    }

    return fleet
  }

  const getTokenBySymbol = async ({ chainId, symbol }: { chainId: number; symbol: string }) => {
    const chain = await sdk.chains.getChainById({
      chainId,
    })

    if (!chain) {
      throw new Error('Chain not found')
    }

    const token = await chain.tokens.getTokenBySymbol({ symbol })

    if (!token) {
      throw new Error(`SDK: Unsupport token: ${symbol}`)
    }

    return token
  }

  const value = {
    getFleetClient,
    getTokenBySymbol,
    getUserClient,
  }

  return <SDKContext.Provider value={value}>{children}</SDKContext.Provider>
}

export const useSDK = () => {
  const context = useContext(SDKContext)

  if (!context) {
    throw new Error('useSDK must be used within a SDKProvider')
  }

  return context
}
