/* eslint-disable no-mixed-operators */
import { SDKChainId } from '@summerfi/app-types'
import { Address, getChainInfoByChainId } from '@summerfi/sdk-common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export interface SumrToClaimData {
  aggregatedRewards: {
    total: number
    perChain: { [key: number]: number }
  }
  claimableAggregatedRewards: {
    total: number
    perChain: { [key: number]: number }
  }
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
  const { user } = await backendSDK.users.getUserClient({
    walletAddress: Address.createFromEthereum({ value: walletAddress }),
    chainInfo: getChainInfoByChainId(SDKChainId.BASE),
  })

  const [aggregatedRewards, claimableAggregatedRewards] = await Promise.all([
    backendSDK.armada.users.getAggregatedRewards({
      user,
    }),
    backendSDK.armada.users.getClaimableAggregatedRewards({
      user,
    }),
  ])

  return {
    aggregatedRewards: {
      total: Number(aggregatedRewards.total) / 10 ** 18,
      perChain: Object.fromEntries(
        Object.entries(aggregatedRewards.perChain).map(([chainId, amount]) => [
          chainId,
          Number(amount) / 10 ** 18,
        ]),
      ),
    },
    claimableAggregatedRewards: {
      total: Number(claimableAggregatedRewards.total) / 10 ** 18,
      perChain: Object.fromEntries(
        Object.entries(claimableAggregatedRewards.perChain).map(([chainId, amount]) => [
          chainId,
          Number(amount) / 10 ** 18,
        ]),
      ),
    },
  }
}
