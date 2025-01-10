import type { ClaimTransactionInfo, IUser } from '@summerfi/sdk-common'

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
  eligibleForClaim: (params: { user: IUser }) => Promise<boolean>

  /**
   * @name claimTX
   * @description Claims the rewards for a user from a vault
   * @param params.index The index of a distribution
   * @param params.user The user
   * @returns Promise<TransactionInfoClaim>
   * @throws Error
   */
  getClaimTX: (params: { index: string; user: IUser }) => Promise<ClaimTransactionInfo | null>

  /**
   * @name claimAllTX
   * @description Claims the rewards for a user from multiple vaults
   * @param params.user The user
   * @returns Promise<TransactionInfoClaim>
   * @throws Error
   */
  getClaimAllTX: (params: { user: IUser }) => Promise<ClaimTransactionInfo>
}
