import type { AddressValue, ChainId } from '@summerfi/sdk-common'
import type {
  MerklClaimTransactionInfo,
  ToggleAQasMerklRewardsOperatorTransactionInfo,
} from '@summerfi/sdk-common'

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

  /**
   * @name getUserMerklClaimTx
   * @description Generates a transaction to claim Merkl rewards for a user on a specific chain
   * @param params.address The user's address
   * @param params.chainId The chain ID to claim rewards on
   * @param params.useMerklDistributorDirectly Optional flag to use Merkl distributor directly (default: false)
   * @returns Promise<[MerklClaimTransactionInfo] | undefined> Array containing the claim transaction, or undefined if no rewards to claim
   */
  getUserMerklClaimTx: (params: {
    address: AddressValue
    chainId: ChainId
  }) => Promise<[MerklClaimTransactionInfo] | undefined>

  /**
   * @name getUserMerklClaimDirectTx
   * @description Generates a transaction to directly claim Merkl rewards for a user on a specific chain
   * @param params.address The user's address
   * @param params.chainId The chain ID to claim rewards on
   * @param params.rewardsTokens Optional array of token addresses to claim (default: all tokens)
   * @param params.useMerklDistributorDirectly Optional flag to use Merkl distributor directly (default: false)
   * @returns Promise<[MerklClaimTransactionInfo] | undefined> Array containing the claim transaction, or undefined if no rewards to claim
   */
  getUserMerklClaimDirectTx: (params: {
    address: AddressValue
    chainId: ChainId
    rewardsTokens?: `0x${string}`[]
    useMerklDistributorDirectly?: boolean
  }) => Promise<[MerklClaimTransactionInfo] | undefined>

  /**
   * @name getAuthorizeAsMerklRewardsOperatorTx
   * @description Generates a transaction to toggle AdmiralsQuarters as a Merkl rewards operator for a user
   * @param params.chainId The chain ID to perform the operation on
   * @param params.user The user's address
   * @returns Promise<[ToggleAQasMerklRewardsOperatorTransactionInfo]> Array containing the toggle transaction
   */
  getAuthorizeAsMerklRewardsOperatorTx: (params: {
    chainId: ChainId
    user: AddressValue
  }) => Promise<[ToggleAQasMerklRewardsOperatorTransactionInfo]>

  /**
   * @name getIsAuthorizedAsMerklRewardsOperator
   * @description Checks if AdmiralsQuarters is authorized as a Merkl rewards operator for a user
   * @param params.chainId The chain ID to check authorization on
   * @param params.user The user's address
   * @returns Promise<boolean> True if AdmiralsQuarters is authorized as operator, false otherwise
   */
  getIsAuthorizedAsMerklRewardsOperator: (params: {
    chainId: ChainId
    user: AddressValue
  }) => Promise<boolean>
}
