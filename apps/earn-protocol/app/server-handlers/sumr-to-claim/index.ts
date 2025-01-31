/* eslint-disable no-mixed-operators */
import { SDKChainId } from '@summerfi/app-types'
import { getChainInfoByChainId } from '@summerfi/sdk-common'
import { Address } from '@summerfi/sdk-common/common'
import { unstable_cache as unstableCache } from 'next/cache'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { REVALIDATION_TIMES } from '@/constants/revalidations'

export interface SumrToClaimData {
  total: number
  perChain: { [key: number]: number }
}

/**
 * Retrieves the total SUMR tokens available to claim for a given wallet address
 * @param {Object} params - The function parameters
 * @param {string} params.walletAddress - Ethereum wallet address to check claimable SUMR tokens
 * @returns {Promise<SumrToClaimData>} Object containing total claimable amount and per-chain breakdown
 */
export const getSumrToClaim = async ({
  walletAddress,
}: {
  walletAddress: string
}): Promise<SumrToClaimData> => {
  return await unstableCache(
    async () => {
      const { user } = await backendSDK.users.getUserClient({
        walletAddress: Address.createFromEthereum({ value: walletAddress }),
        chainInfo: getChainInfoByChainId(SDKChainId.BASE),
      })

      const aggregatedRewards = await backendSDK.armada.users.getAggregatedRewards({
        user,
      })

      return {
        total: Number(aggregatedRewards.total) / 10 ** 18,
        perChain: Object.fromEntries(
          Object.entries(aggregatedRewards.perChain).map(([chainId, amount]) => [
            chainId,
            Number(amount) / 10 ** 18,
          ]),
        ),
      }
    },
    ['walletAddress'],
    {
      revalidate: REVALIDATION_TIMES.PORTFOLIO_DATA,
    },
  )()
}
