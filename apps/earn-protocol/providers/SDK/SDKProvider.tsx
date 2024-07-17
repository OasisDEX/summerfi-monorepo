'use client'
import React, { type PropsWithChildren } from 'react'
import { makeSDK } from '@summerfi/sdk-client'
import { Address } from '@summerfi/sdk-common'

import { SDKContext } from './context'

export const sdkApiUrl = '/api/sdk'

export type Props = {
  //
}
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
