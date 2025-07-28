'use client'
import { SupportedNetworkIds } from '@summerfi/app-types'
import { ADDRESS_ZERO } from '@summerfi/app-utils'
import { SummerTokenAbi } from '@summerfi/armada-protocol-abis'
import { getChainInfoByChainId } from '@summerfi/sdk-common'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { type Address } from 'viem'
import { base } from 'viem/chains'

import { useAppSDK } from '@/hooks/use-app-sdk'
import { usePublicClient } from '@/hooks/use-public-client'

type DecayFactorResponse = {
  decayFactor: number | undefined
  isLoading: boolean
  error: Error | null
}

/**
 * Custom hook to fetch the decay factor for a delegated address
 * The decay factor represents the voting power reduction over time for delegated tokens
 *
 * @param delegatedAddress - Ethereum address of the delegated account
 * @returns {DecayFactorResponse} Object containing:
 *  - decayFactor: The current decay factor value (undefined if not loaded)
 *  - isLoading: Loading state indicator
 *  - error: Error object if request fails
 */
export const useDecayFactor = (delegatedAddress?: string): DecayFactorResponse => {
  const sdk = useAppSDK()
  const { publicClient } = usePublicClient({ chain: base })

  const fetchDecayFactor = async (address: Address): Promise<number> => {
    try {
      const sumrToken = await sdk
        .getSummerToken({
          chainInfo: getChainInfoByChainId(SupportedNetworkIds.Base),
        })
        .catch((getSummerTokenError) => {
          throw new Error(`Failed to fetch SUMMER token: ${getSummerTokenError.message}`)
        })

      const decayFactor = await publicClient
        .readContract({
          abi: SummerTokenAbi,
          address: sumrToken.address.value,
          functionName: 'getDecayFactor',
          args: [address],
        })
        .catch((decayFactorError) => {
          throw new Error(`Failed to fetch decay factor: ${decayFactorError.message}`)
        })

      if (!decayFactor) {
        throw new Error('Failed to fetch decay factor')
      }

      return new BigNumber(decayFactor.toString()).shiftedBy(-sumrToken.decimals).toNumber()
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unknown error occurred')
    }
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ['decayFactor', delegatedAddress],
    queryFn: () => (delegatedAddress ? fetchDecayFactor(delegatedAddress as Address) : undefined),
    enabled: delegatedAddress !== ADDRESS_ZERO,
  })

  return {
    decayFactor: data,
    isLoading,
    error: error as Error | null,
  }
}
