import { makeSDK } from '@summerfi/sdk-client'
import { Address } from '@summerfi/sdk-common'
import { useMemo } from 'react'

import { sdkApiUrl } from '@/constants/sdk'

export const useSDK = () => {
  const sdk = useMemo(() => makeSDK({ apiURL: sdkApiUrl }), [])

  const getUserClient = useMemo(
    () =>
      async ({ chainId, walletAddress }: { chainId: number; walletAddress: string }) => {
        const chain = await sdk.chains.getChainById({
          chainId,
        })

        if (!chain) {
          throw new Error('Chain not found')
        }
        const user = await sdk.users
          .getUser({
            chainInfo: chain.chainInfo,
            walletAddress: Address.createFromEthereum({ value: walletAddress }),
          })
          .catch((error) => {
            throw new Error(`Failed to get user: ${error.message}`)
          })

        return user
      },
    [sdk],
  )

  const getFleetClient = useMemo(
    () =>
      async ({ chainId, fleetAddress }: { chainId: number; fleetAddress: string }) => {
        const chain = await sdk.chains.getChainById({
          chainId,
        })

        if (!chain) {
          throw new Error('Chain not found')
        }
        const fleet = chain.armada.getFleet({
          address: Address.createFromEthereum({ value: fleetAddress }),
        })

        if (!fleet) {
          throw new Error(`SDK: Fleet not found: ${fleetAddress}`)
        }

        return fleet
      },
    [sdk],
  )

  const getTokenBySymbol = useMemo(
    () =>
      async ({ chainId, symbol }: { chainId: number; symbol: string }) => {
        const chain = await sdk.chains.getChainById({
          chainId,
        })

        if (!chain) {
          throw new Error('Chain not found')
        }

        const token = await chain.tokens.getTokenBySymbol({ symbol }).catch((error) => {
          throw new Error(`Failed to get token: ${error.message}`)
        })

        if (!token) {
          throw new Error(`SDK: Unsupport token: ${symbol}`)
        }

        return token
      },
    [sdk],
  )

  return {
    getFleetClient,
    getTokenBySymbol,
    getUserClient,
  }
}
