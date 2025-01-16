import type {
  DelegateTransactionInfo,
  IAddress,
  IUser,
  StakeTransactionInfo,
  UnstakeTransactionInfo,
} from '@summerfi/sdk-common'

/**
 * @name IArmadaManagerToken
 * @description Interface for the Armada Manager Token which handles delegating votes
 *
 */
export interface IArmadaManagerToken {
  /**
   * @name delegates
   * @description Returns delegatee that the account has chosen
   * @param params.user The user
   * @returns Promise<boolean>
   * @throws Error
   */
  delegates: (params: { user: IUser }) => Promise<IAddress>

  /**
   * @name getDelegateTx
   * @description Delegates votes from the sender to delegatee
   * @param params.user The user
   * @returns Promise<boolean>
   * @throws Error
   */
  getDelegateTx: (params: { user: IUser }) => Promise<DelegateTransactionInfo>

  /**
   * @name getUndelegateTx
   * @description Undelegates votes from the sender
   * @returns Promise<boolean>
   * @throws Error
   */
  getUndelegateTx: () => Promise<DelegateTransactionInfo>

  /**
   * @name getVotes
   * @description Returns the current amount of votes that account has
   * @param params.user The user
   * @returns Promise<TransactionInfoClaim>
   * @throws Error
   */
  getVotes: (params: { user: IUser }) => Promise<bigint>

  /**
   * @name getStakedBalance
   * @description Returns the current amount of tokens that account has staked
   * @param params.user The user
   * @returns Promise<bigint>
   * @throws Error
   */
  getStakedBalance: (params: { user: IUser }) => Promise<bigint>

  /**
   * @name getStakeTx
   * @description Stakes an amount of tokens
   * @param params.amount The amount to stake
   * @returns Promise<StakeTransactionInfo>
   * @throws Error
   */
  getStakeTx: (params: { amount: bigint }) => Promise<StakeTransactionInfo>

  /**
   * @name getUnstakeTx
   * @description Unstakes an amount of tokens
   * @param params.amount The amount to unstake
   * @returns Promise<UnstakeTransactionInfo>
   * @throws Error
   */
  getUnstakeTx: (params: { amount: bigint }) => Promise<UnstakeTransactionInfo>
}
