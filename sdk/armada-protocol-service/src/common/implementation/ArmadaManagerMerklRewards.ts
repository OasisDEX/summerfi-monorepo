import type { IArmadaManagerMerklRewards, MerklReward } from '@summerfi/armada-protocol-common'
import {
  isChainId,
  LoggingService,
  type ChainId,
  type IChainInfo,
  type MerklClaimTransactionInfo,
  TransactionType,
  Address,
} from '@summerfi/sdk-common'
import { encodeFunctionData } from 'viem'
import { merklClaimAbi } from './abi/merklClaimAbi'

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
    const { address, chainIds = this._supportedChainIds } = params
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

  async getUserMerklClaimTx(
    params: Parameters<IArmadaManagerMerklRewards['getUserMerklClaimTx']>[0],
  ): ReturnType<IArmadaManagerMerklRewards['getUserMerklClaimTx']> {
    const { address, chainId } = params

    LoggingService.log('Generating Merkl claim transaction', {
      address,
      chainId,
    })

    // Contract addresses for Merkl distributor on supported chains
    const MERKL_DISTRIBUTOR_ADDRESSES: Partial<Record<ChainId, string>> = {
      1: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Ethereum
      10: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Optimism
      8453: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Base
      42161: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Arbitrum
      146: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Sonic
    }

    // Validate chain ID is supported
    const distributorAddress = MERKL_DISTRIBUTOR_ADDRESSES[chainId]
    if (!distributorAddress) {
      throw new Error(`Unsupported chain ID for Merkl claims: ${chainId}`)
    }

    // Get user's Merkl rewards for this specific chain
    const rewardsData = await this.getUserMerklRewards({
      address,
      chainIds: [chainId],
    })

    const chainRewards = rewardsData.perChain[chainId]
    if (!chainRewards || chainRewards.length === 0) {
      LoggingService.log('No claimable Merkl rewards found', {
        address,
        chainId,
      })
      return undefined
    }

    // Prepare arrays for the claim function
    const users: `0x${string}`[] = []
    const tokens: `0x${string}`[] = []
    const amounts: bigint[] = []
    const proofs: `0x${string}`[][] = []

    for (const reward of chainRewards) {
      users.push(address as `0x${string}`)
      tokens.push(reward.token.address as `0x${string}`)
      amounts.push(BigInt(reward.amount))
      proofs.push(reward.proofs as `0x${string}`[])
    }

    // Encode the claim function call
    const calldata = encodeFunctionData({
      abi: merklClaimAbi,
      functionName: 'claim',
      args: [users, tokens, amounts, proofs],
    })

    const merklClaimTx: MerklClaimTransactionInfo = {
      type: TransactionType.MerklClaim,
      description: 'Claiming Merkle rewards',
      transaction: {
        target: Address.createFromEthereum({ value: distributorAddress }),
        calldata: calldata,
        value: '0',
      },
    }

    LoggingService.log('Generated Merkl claim transaction', {
      rewardsCount: chainRewards.length,
      target: distributorAddress,
    })

    return [merklClaimTx]
  }
}
