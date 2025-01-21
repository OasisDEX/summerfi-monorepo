import { SDKChainId } from '@summerfi/app-types'
import { getChainInfoByChainId } from '@summerfi/sdk-common'
import { Address } from '@summerfi/sdk-common/common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

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
  const { user } = await backendSDK.users.getUserClient({
    walletAddress: Address.createFromEthereum({ value: walletAddress }),
    chainInfo: getChainInfoByChainId(SDKChainId.BASE),
  })

  const aggregatedRewards = await backendSDK.armada.users.getAggregatedRewards({
    user,
  })

  return {
    total: Number(aggregatedRewards.total),
    perChain: Object.fromEntries(
      Object.entries(aggregatedRewards.perChain).map(([chainId, amount]) => [
        chainId,
        Number(amount),
      ]),
    ),
  }
}
