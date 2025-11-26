import type {
  ChainInfo,
  ClaimTransactionInfo,
  IAddress,
  IChainInfo,
  IUser,
} from '@summerfi/sdk-common'
import type { Claim } from '../../distributions'

/**
 * @name IArmadaManagerClaims
 * @description Interface for the Armada Manager Claims which handles generating transactions for claims
 */
export interface IArmadaManagerClaims {
  /**
   * @name canClaimDistributions
   * @description Checks if a user is eligible for a claim
   * @param params.user The user
   * @returns Promise<boolean>
   * @throws Error
   */
  canClaimDistributions: (params: {
    user: IUser
  }) => Promise<Record<string, Record<string, boolean>>>

  /**
   * @name hasClaimedDistributions
   * @description Checks if a user has claimed
   * @param params.user The user
   * @returns Promise<boolean>
   * @throws Error
   */
  hasClaimedDistributions: (params: {
    user: IUser
    merkleClaims: Claim[]
  }) => Promise<Record<string, Record<string, boolean>>>

  /**
   * @name getAggregatedRewards
   * @description Returns the total aggregated rewards a user is eligible to claim cross-chain
   * @param params.user The user
   * @returns Promise<{
   *  total: bigint
   *  vaultUsagePerChain: Record<number, bigint>
   *  vaultUsage: bigint
   *  merkleDistribution: bigint
   *  voteDelegation: bigint
   * }>
   * @throws Error
   */
  getAggregatedRewards: (params: { user: IUser }) => Promise<{
    total: bigint
    vaultUsagePerChain: Record<number, bigint>
    vaultUsage: bigint
    merkleDistribution: bigint
    voteDelegation: bigint
    /**
     * @deprecated use `vaultUsagePerChain` instead
     */
    perChain: Record<number, bigint>
  }>

  /**
   * @name getAggregatedRewardsIncludingMerkl
   * @description Returns the total aggregated rewards a user is eligible to claim cross-chain including Merkl
   * @param params.user The user
   * @returns Promise<{
   *  total: bigint
   *  vaultUsagePerChain: Record<number, bigint>
   *  vaultUsage: bigint
   *  merkleDistribution: bigint
   *  voteDelegation: bigint
   * }>
   * @throws Error
   */
  getAggregatedRewardsIncludingMerkl: (params: { user: IUser }) => Promise<{
    total: bigint
    vaultUsagePerChain: Record<number, bigint>
    vaultUsage: bigint
    merkleDistribution: bigint
    voteDelegation: bigint
  }>

  /**
   * @name getClaimDistributionTx
   * @description Claims distribution rewards for a user
   * @param params.user The user
   * @returns Promise<TransactionInfoClaim>
   * @throws Error
   */
  getClaimDistributionTx: (params: { user: IUser }) => Promise<ClaimTransactionInfo[] | undefined>

  /**
   * @name getClaimVoteDelegationRewardsTx
   * @description Claims governance rewards for a user
   * @param params.rewardToken The reward token
   * @returns Promise<TransactionInfoClaim>
   * @throws Error
   */
  getClaimVoteDelegationRewardsTx: (params: {
    govRewardsManagerAddress: IAddress // z summertoken rewards manager
    rewardToken: IAddress
  }) => Promise<[ClaimTransactionInfo]>

  /**
   * @name getClaimProtocolUsageRewardsTx
   * @description Claims protocol usage rewards for a user
   * @param params.user The user
   * @param params.chainInfo The chain info
   * @param params.fleetCommandersAddresses The fleet commanders addresses
   * @param params.rewardToken The reward token
   * @returns Promise<TransactionInfoClaim>
   * @throws Error
   */
  getClaimProtocolUsageRewardsTx: (params: {
    user: IUser
    chainInfo: IChainInfo
    fleetCommandersAddresses: IAddress[]
    rewardToken: IAddress
  }) => Promise<[ClaimTransactionInfo]>

  /**
   * @name getAggregatedClaimsForChainTx
   * @description Returns the multicall transaction needed to claim rewards from the Fleet
   *
   * @param chainInfo Chain information
   * @param user Address of the user that is trying to claim
   * @param includeMerkl Whether to include Merkl rewards in the claim
   *
   * @returns The transaction needed to claim the rewards
   */
  getAggregatedClaimsForChainTx(params: {
    chainInfo: ChainInfo
    user: IUser
    includeMerkl?: boolean
  }): Promise<[ClaimTransactionInfo] | undefined>
}
