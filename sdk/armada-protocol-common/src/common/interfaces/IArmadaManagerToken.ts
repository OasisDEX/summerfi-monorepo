import type { DelegateTransactionInfo, IAddress, IUser } from '@summerfi/sdk-common'

/**
 * @name IArmadaManagerToken
 * @description Interface for the Armada Manager Token which handles delegating votes
 *
 */
export interface IArmadaManagerToken {
  /**
   * @name delegate
   * @description Delegates votes from the sender to delegatee
   * @param params.user The user
   * @returns Promise<boolean>
   * @throws Error
   */
  getDelegateTx: (params: { user: IUser }) => Promise<DelegateTransactionInfo>

  /**
   * @name delegates
   * @description Returns delegatee that the account has chosen
   * @param params.user The user
   * @returns Promise<boolean>
   * @throws Error
   */
  delegates: (params: { user: IUser }) => Promise<IAddress>

  /**
   * @name getVotes
   * @description Returns the current amount of votes that account has
   * @param params.user The user
   * @returns Promise<TransactionInfoClaim>
   * @throws Error
   */
  getVotes: (params: { user: IUser }) => Promise<bigint>
}
