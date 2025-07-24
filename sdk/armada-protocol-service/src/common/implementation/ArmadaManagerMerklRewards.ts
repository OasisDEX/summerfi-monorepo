import type { IArmadaManagerMerklRewards, MerklReward } from '@summerfi/armada-protocol-common'
import { LoggingService } from '@summerfi/sdk-common'

/**
 * Response type from Merkl API for user rewards
 */
interface MerklApiReward {
  token: {
    chainId: number
    address: string
    symbol: string
    decimals: number
    price: number
  }
  root: string
  recipient: string
  amount: string
  claimed: string
  pending: string
  proofs?: string[]
}

interface MerklApiResponse {
  rewards: MerklApiReward[]
}

/**
 * @name ArmadaManagerMerklRewards
 * @description Implementation of the IArmadaManagerMerklRewards interface for managing Merkl rewards
 */
export class ArmadaManagerMerklRewards implements IArmadaManagerMerklRewards {
  constructor() {
    // No dependencies needed for this implementation
  }

  async getUserMerklRewards(
    params: Parameters<IArmadaManagerMerklRewards['getUserMerklRewards']>[0],
  ): Promise<MerklReward[]> {
    const { user, chainIds = [1, 8453, 42161, 146] } = params
    const userAddress = user.wallet.address.value

    LoggingService.log('Fetching Merkl rewards for user', {
      address: userAddress,
      chainIds: chainIds,
    })

    try {
      // Build the URL with chain ID filters
      const chainIdParam = chainIds.join(',')
      const url = `https://api.merkl.xyz/v4/users/${userAddress}/rewards?chainId=${chainIdParam}&claimableOnly=true`

      LoggingService.debug('Making request to Merkl API', { url })

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Merkl API request failed: ${response.status} ${response.statusText}`)
      }

      const data = (await response.json()) as MerklApiResponse

      if (!data.rewards || !Array.isArray(data.rewards)) {
        LoggingService.log('Invalid response from Merkl API', { data })
        return []
      }

      // Map response to our interface, picking only required properties
      const merklRewards: MerklReward[] = data.rewards.map((reward: MerklApiReward) => ({
        token: reward.token,
        root: reward.root,
        recipient: reward.recipient,
        amount: reward.amount,
        claimed: reward.claimed,
        pending: reward.pending,
        proofs: reward.proofs || [],
      }))

      LoggingService.log('Successfully fetched Merkl rewards', {
        address: userAddress,
        rewardsCount: merklRewards.length,
      })

      return merklRewards
    } catch (error) {
      LoggingService.log('Failed to fetch Merkl rewards', {
        address: userAddress,
        chainIds: chainIds,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `Failed to fetch Merkl rewards: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }
}
