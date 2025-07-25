import type { AddressValue, ChainId } from '@summerfi/sdk-common'

/**
 * @name MerklReward
 * @description Represents a Merkl reward for a user
 */
export interface MerklReward {
  /** The token address for the reward */
  token: {
    chainId: number
    address: string
    symbol: string
    decimals: number
    price: number
  }
  /** The merkle root for the reward */
  root: string
  /** The recipient address */
  recipient: string
  /** The reward amount */
  amount: string
  /** The claimed amount */
  claimed: string
  /** The pending amount */
  pending: string
  /** The merkle proofs for claiming */
  proofs: string[]
}

/**
 * @name IArmadaManagerMerklRewards
 * @description Interface for managing Merkl rewards for Armada users
 */
export interface IArmadaManagerMerklRewards {
  /**
   * @name getUserMerklRewards
   * @description Gets Merkl rewards for a user across specified chains
   * @param params.address The user's address
   * @param params.chainIds Optional chain IDs to filter by (default: supported chains)
   * @returns Promise<MerklReward[]> Array of Merkl rewards
   */
  getUserMerklRewards: (params: { address: AddressValue; chainIds?: ChainId[] }) => Promise<{
    perChain: Partial<Record<ChainId, MerklReward[]>>
  }>
}
