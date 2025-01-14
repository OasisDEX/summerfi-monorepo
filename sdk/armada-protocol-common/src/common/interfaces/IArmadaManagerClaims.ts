import type { ClaimTransactionInfo, IAddress, IChainInfo, IUser } from '@summerfi/sdk-common'

/**
 * @name IArmadaManagerClaims
 * @description Interface for the Armada Manager Claims which handles generating transactions for claims
 */
export interface IArmadaManagerClaims {
  /**
   * @name eligibleForClaim
   * @description Checks if a user is eligible for a claim
   * @param params.user The user
   * @returns Promise<boolean>
   * @throws Error
   */
  canClaim: (params: { user: IUser }) => Promise<[bigint, boolean][]>

  /**
   * @name hasClaimed
   * @description Checks if a user has claimed
   * @param params.user The user
   * @returns Promise<boolean>
   * @throws Error
   */
  hasClaimed: (params: { user: IUser }) => Promise<[bigint, boolean][]>

  /**
   * @name amountToClaim
   * @description Returns the amount a user is eligible to claim
   * @param params.user The user
   * @returns Promise<number>
   * @throws Error
   */
  amountToClaim: (params: { user: IUser }) => Promise<bigint>

  /**
   * @name getClaimMerkleRewardsTx
   * @description Claims merkle rewards for a user
   * @param params.user The user
   * @returns Promise<TransactionInfoClaim>
   * @throws Error
   */
  getClaimMerkleRewardsTx: (params: { user: IUser }) => Promise<ClaimTransactionInfo>

  /**
   * @name getClaimGovernanceRewardsTx
   * @description Claims governance rewards for a user
   * @param params.rewardToken The reward token
   * @returns Promise<TransactionInfoClaim>
   * @throws Error
   */
  getClaimGovernanceRewardsTx: (params: {
    govRewardsManagerAddress: IAddress // z summertoken rewards manager
    rewardToken: IAddress
  }) => Promise<ClaimTransactionInfo>

  /**
   * @name getClaimFleetRewardsTx
   * @description Claims fleet rewards for a user
   * @param params.user The user
   * @param params.chainInfo The chain info
   * @param params.fleetCommandersAddresses The fleet commanders addresses
   * @param params.rewardToken The reward token
   * @returns Promise<TransactionInfoClaim>
   * @throws Error
   */
  getClaimFleetRewardsTx: (params: {
    user: IUser
    chainInfo: IChainInfo
    fleetCommandersAddresses: IAddress[]
    rewardToken: IAddress
  }) => Promise<ClaimTransactionInfo>
}
