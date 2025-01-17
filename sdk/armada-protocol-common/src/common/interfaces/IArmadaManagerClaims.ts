import type { ClaimTransactionInfo, IAddress, IChainInfo, IUser } from '@summerfi/sdk-common'

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
  canClaimDistributions: (params: { user: IUser }) => Promise<Record<string, boolean>>

  /**
   * @name hasClaimedDistributions
   * @description Checks if a user has claimed
   * @param params.user The user
   * @returns Promise<boolean>
   * @throws Error
   */
  hasClaimedDistributions: (params: { user: IUser }) => Promise<Record<string, boolean>>

  /**
   * @name aggregatedClaims
   * @description Returns the amount a user is eligible to claim cross-chain
   * @param params.user The user
   * @returns Promise<number>
   * @throws Error
   */
  aggregatedRewards: (params: { user: IUser }) => Promise<{
    total: bigint
    perChain: Record<number, bigint>
  }>

  /**
   * @name getClaimDistributionTx
   * @description Claims distribution rewards for a user
   * @param params.user The user
   * @returns Promise<TransactionInfoClaim>
   * @throws Error
   */
  getClaimDistributionTx: (params: { user: IUser }) => Promise<ClaimTransactionInfo>

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
  }) => Promise<ClaimTransactionInfo>

  /**
   * @name getClaimProtocolUsageRewardsTx
   * @description Claims protoclo usage rewards for a user
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
  }) => Promise<ClaimTransactionInfo>
}
