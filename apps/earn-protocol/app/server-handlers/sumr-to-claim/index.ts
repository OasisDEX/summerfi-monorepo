/* eslint-disable no-mixed-operators */
import { SupportedNetworkIds } from '@summerfi/app-types'
import { Address, type ChainId, getChainInfoByChainId } from '@summerfi/sdk-common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { type MerklIsAuthorizedPerChain } from '@/features/claim-and-delegate/types'

export interface SumrToClaimData {
  aggregatedRewards: {
    total: number
    perChain: { [key: number]: number }
    stakingV2: number
  }
  merklRewards: number
  voteRewards: number
  merklIsAuthorizedPerChain: MerklIsAuthorizedPerChain
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
    chainInfo: getChainInfoByChainId(SupportedNetworkIds.Base),
  })

  const aggregatedRewards = await backendSDK.armada.users.getAggregatedRewardsIncludingMerkl({
    user,
  })

  const chains = Object.keys(aggregatedRewards.perChain)

  const isAuthorizedAsMerklRewardsOperatorPerChain = await Promise.all(
    chains.map((chainId) =>
      backendSDK.armada.users.getIsAuthorizedAsMerklRewardsOperator({
        user: user.wallet.address.value,
        chainId: Number(chainId) as ChainId,
      }),
    ),
  )

  return {
    aggregatedRewards: {
      total: Number(aggregatedRewards.total) / 10 ** 18,
      perChain: Object.fromEntries(
        Object.entries(aggregatedRewards.perChain).map(([chainId, amount]) => [
          chainId,
          Number(amount) / 10 ** 18,
        ]),
      ),
      stakingV2: Number(aggregatedRewards.stakingV2) / 10 ** 18,
    },
    merklRewards: Number(aggregatedRewards.distribution) / 10 ** 18,
    voteRewards: Number(aggregatedRewards.voteDelegation) / 10 ** 18,
    merklIsAuthorizedPerChain: Object.fromEntries(
      chains.map((chainId, index) => [chainId, isAuthorizedAsMerklRewardsOperatorPerChain[index]]),
    ),
  }
}
