import type { IArmadaManagerMerklRewards, MerklReward } from '@summerfi/armada-protocol-common'
import { isChainId, LoggingService, type ChainId, type IChainInfo } from '@summerfi/sdk-common'

/**
 * Response type from Merkl API for user rewards
 */

interface MerklApiChain {
  id: number
  name: string
  icon: string
  liveCampaigns: number
}

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
  proofs: string[]
}

type MerklApiResponse = {
  chain: MerklApiChain
  rewards: MerklApiReward[]
}[]

/**
 * @name ArmadaManagerMerklRewards
 * @description Implementation of the IArmadaManagerMerklRewards interface for managing Merkl rewards
 */
export class ArmadaManagerMerklRewards implements IArmadaManagerMerklRewards {
  private _supportedChainIds: number[]

  constructor(params: { supportedChains: IChainInfo[] }) {
    this._supportedChainIds = params.supportedChains.map((chain) => chain.chainId)
  }

  async getUserMerklRewards(
    params: Parameters<IArmadaManagerMerklRewards['getUserMerklRewards']>[0],
  ): ReturnType<IArmadaManagerMerklRewards['getUserMerklRewards']> {
    const { address, chainIds = [this._supportedChainIds] } = params
    const userAddress = address

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
        LoggingService.log('Merkl API request failed', {
          status: response.status,
          statusText: response.statusText,
          url,
        })
        throw new Error(`Merkl API request failed: ${response.status} ${response.statusText}`)
      }

      const data = (await response.json()) as MerklApiResponse

      if (!data || !Array.isArray(data)) {
        LoggingService.log('Invalid response from Merkl API', { data })
        throw new Error('Invalid response from Merkl API')
      }

      // Map response to our interface, picking only required properties
      const merklRewardsPerChain: Partial<Record<ChainId, MerklReward[]>> = {}

      data.forEach((item) => {
        const chainId = item.chain.id
        const rewards: MerklReward[] = item.rewards.map((reward) => ({
          token: reward.token,
          root: reward.root,
          recipient: reward.recipient,
          amount: reward.amount,
          claimed: reward.claimed,
          pending: reward.pending,
          proofs: reward.proofs,
        }))

        if (!isChainId(chainId)) {
          throw new Error(`Invalid chain ID: ${chainId}`)
        }
        if (!merklRewardsPerChain[chainId]) {
          merklRewardsPerChain[chainId] = []
        }
        merklRewardsPerChain[chainId].push(...rewards)
      })

      LoggingService.log('Successfully fetched Merkl rewards', {
        address: userAddress,
        merklRewardsPerChain: merklRewardsPerChain,
      })

      return { perChain: merklRewardsPerChain }
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
