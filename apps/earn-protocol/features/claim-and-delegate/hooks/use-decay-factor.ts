'use client'
import { SDKChainId } from '@summerfi/app-types'
import { SummerTokenAbi } from '@summerfi/armada-protocol-abis'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { type Address, createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

import { SDKChainIdToRpcGatewayMap } from '@/constants/networks-list'
import { useAppSDK } from '@/hooks/use-app-sdk'

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

  const fetchDecayFactor = async (address: Address): Promise<number> => {
    const publicClient = createPublicClient({
      chain: base,
      transport: http(SDKChainIdToRpcGatewayMap[SDKChainId.BASE]),
    })

    const sumrToken = await sdk.getTokenBySymbol({
      chainId: SDKChainId.BASE,
      symbol: 'SUMMER',
    })

    const decayFactor = await publicClient.readContract({
      abi: SummerTokenAbi,
      address: sumrToken.address.value,
      functionName: 'getDecayFactor',
      args: [address],
    })

    if (!decayFactor) {
      throw new Error('Failed to fetch decay factor')
    }

    return new BigNumber(decayFactor.toString()).shiftedBy(-sumrToken.decimals).toNumber()
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['decayFactor', delegatedAddress],
    queryFn: () => (delegatedAddress ? fetchDecayFactor(delegatedAddress as Address) : undefined),
    enabled: !!delegatedAddress,
  })

  return {
    decayFactor: data,
    isLoading,
    error: error as Error | null,
  }
}
