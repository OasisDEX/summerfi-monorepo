import type {
  ApproveTransactionInfo,
  DelegateTransactionInfo,
  IAddress,
  IUser,
  StakeTransactionInfo,
  UnstakeTransactionInfo,
} from '@summerfi/sdk-common'

/**
 * @name IArmadaManagerGovernance
 * @description Interface for the Armada Manager Token which handles delegating votes
 *
 */
export interface IArmadaManagerGovernance {
  /**
   * @method getUserDelegatee
   * @description Returns delegatee that the account has chosen
   *
   * @param user The user
   *
   * @returns The delegatee address
   */
  getUserDelegatee: (params: { user: IUser }) => Promise<IAddress>

  /**
   * @method getDelegateTx
   * @description Delegates votes from the sender to delegatee
   *
   * @param user The user
   *
   * @returns The transaction information
   */
  getDelegateTx: (params: { user: IUser }) => Promise<[DelegateTransactionInfo]>

  /**
   * @method getUndelegateTx
   * @description Undelegates votes from the sender
   *
   * @returns The transaction information
   */
  getUndelegateTx: () => Promise<[DelegateTransactionInfo]>

  /**
   * @method getUserVotes
   * @description Returns the number of votes the user has
   *
   * @param user The user
   *
   * @returns The number of votes
   */
  getUserVotes: (params: { user: IUser }) => Promise<bigint>

  /**
   * @method getUserBalance
   * @description Returns the balance of the user
   *
   * @param user The user
   *
   * @returns The balance
   */
  getUserBalance: (params: { user: IUser }) => Promise<bigint>

  /**
   * @method getUserStakedBalance
   * @description Returns the staked balance of the user
   *
   * @param user The user
   *
   * @returns The staked balance
   */
  getUserStakedBalance: (params: { user: IUser }) => Promise<bigint>

  /**
   * @method getUserEarnedRewards
   * @description Returns the rewards the user has earned
   *
   * @param user The user
   *
   * @returns The rewards earned
   */
  getUserEarnedRewards: (params: { user: IUser }) => Promise<bigint>

  /**
   * @method getStakeTx
   * @description Returns the transaction to stake tokens
   *
   * @param user The user
   * @param amount The amount to stake
   *
   * @returns The transaction information
   */
  getStakeTx: (params: {
    user: IUser
    amount: bigint
  }) => Promise<[ApproveTransactionInfo, StakeTransactionInfo] | [StakeTransactionInfo]>

  /**
   * @method getUnstakeTx
   * @description Returns the transaction to unstake tokens
   *
   * @param amount The amount to unstake
   *
   * @returns The transaction information
   */
  getUnstakeTx: (params: { amount: bigint }) => Promise<[UnstakeTransactionInfo]>

  /**
   * @method getDelegationChainLength
   * @description Returns the length of the delegation chain
   *
   * @param user The user
   *
   * @returns The length of the delegation chain
   */
  getDelegationChainLength: (params: { user: IUser }) => Promise<number>

  /**
   * @method getStakeTxV2
   * @description Returns the transaction to stake tokens (V2)
   *
   * @param user The user
   * @param amount The amount to stake
   *
   * @returns The transaction information
   */
  getStakeTxV2: (params: {
    user: IUser
    amount: bigint
  }) => Promise<[ApproveTransactionInfo, StakeTransactionInfo] | [StakeTransactionInfo]>

  /**
   * @method getUnstakeTxV2
   * @description Returns the transaction to unstake tokens (V2)
   *
   * @param amount The amount to unstake
   *
   * @returns The transaction information
   */
  getUnstakeTxV2: (params: { amount: bigint }) => Promise<[UnstakeTransactionInfo]>
}
