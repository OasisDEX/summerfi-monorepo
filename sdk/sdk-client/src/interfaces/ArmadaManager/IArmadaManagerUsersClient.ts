import {
  IArmadaVaultId,
  IArmadaVaultInfo,
  IArmadaPosition,
  IArmadaPositionId,
  type GetVaultQuery,
  type GetVaultsQuery,
  type GetGlobalRebalancesQuery,
  type GetUsersActivityQuery,
  type GetUserActivityQuery,
} from '@summerfi/armada-protocol-common'
import {
  ITokenAmount,
  IUser,
  TransactionInfo,
  type ChainInfo,
  type ExtendedTransactionInfo,
  type IAddress,
  type IPercentage,
  type IToken,
} from '@summerfi/sdk-common'

/**
 * @interface IArmadaManagerUsersClient
 * @description Interface of the FleetCommander Users manager for the SDK Client. Allows to instantiate
 *              FleetCommanders to interact with them
 */
export interface IArmadaManagerUsersClient {
  /**
   * @method getVaultsRaw
   * @description Retrieves all protocol vaults
   *
   * @param chainInfo Chain information
   *
   * @returns All Armada vaults
   */
  getVaultsRaw(params: { chainInfo: ChainInfo }): Promise<GetVaultsQuery>

  /**
   * @method getVaultRaw
   * @description Retrieves a specific protocol vault
   *
   * @param vaultId ID of the vault
   *
   * @returns The corresponding Armada vault
   */
  getVaultRaw(params: { vaultId: IArmadaVaultId }): Promise<GetVaultQuery>

  /**
   * @name getGlobalRebalancesRaw
   * @description Get all rebalances per given chain
   *
   * @param chainInfo Chain information
   *
   * @returns GerRebalancesQuery
   */
  getGlobalRebalancesRaw(params: { chainInfo: ChainInfo }): Promise<GetGlobalRebalancesQuery>

  /**
   * @name getUsersActivityRaw
   * @description Get all users activity per given chain
   *
   * @param chainInfo Chain information
   *
   * @returns GerUsersActivityQuery
   */
  getUsersActivityRaw(params: { chainInfo: ChainInfo }): Promise<GetUsersActivityQuery>

  /**
   * @name getUserActivityRaw
   * @description Get all users activity per given chain
   *
   * @param vaultId ID of the pool to retrieve
   *
   * @returns GerUserActivityQuery
   */
  getUserActivityRaw(params: { vaultId: IArmadaVaultId }): Promise<GetUserActivityQuery>

  /**
   * @method getVaultInfo
   * @description Retrieves the information of an Armada vault by its ID
   *
   * @param vaultId ID of the vault to retrieve
   *
   * @returns The information of the corresponding Armada vault
   */
  getVaultInfo(params: { vaultId: IArmadaVaultId }): Promise<IArmadaVaultInfo>

  /**
   * @name getUserPositions
   * @description Get all of user positions in the fleet
   *
   * @param user target user
   *
   * @returns IArmadaPosition[] All user positions in the fleet
   *
   */
  getUserPositions(params: { user: IUser }): Promise<IArmadaPosition[]>

  /**
   * @method getUserPosition
   * @description Retrieves the position of a user in an Armada pool
   *
   * @param user Target user
   * @param fleetAddress Address of the fleet
   *
   * @returns The position of the user in the corresponding Armada pool
   */
  getUserPosition(params: { user: IUser; fleetAddress: IAddress }): Promise<IArmadaPosition>

  /**
   * @method getPosition
   * @description Retrieves the position of a user in an Armada pool
   *
   * @param positionId ID of the position to retrieve
   *
   * @returns The position of the user in the corresponding Armada pool
   */
  getPosition(params: { positionId: IArmadaPositionId }): Promise<IArmadaPosition>

  /**
   * @method getNewDepositTX
   * @description Returns the transactions needed to deposit tokens in the Fleet for a new position
   *
   * @param vaultId ID of the pool to deposit in
   * @param user Address of the user that is trying to deposit
   * @param amount Token amount to be deposited
   * @param slippage Maximum slippage allowed
   * @param shouldStake Whether the user wants to stake the deposited tokens
   *
   * @returns The transactions needed to deposit the tokens
   */
  getNewDepositTX(params: {
    vaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    slippage: IPercentage
    shouldStake?: boolean
  }): Promise<ExtendedTransactionInfo[]>

  /**
   * @method getWithdrawTX
   * @description Returns the transactions needed to withdraw tokens from the Fleet
   *
   * @param vaultId ID of the pool to withdraw from
   * @param user user that is trying to withdraw
   * @param amount Token amount to be withdrawn
   * @param toToken Token to withdraw to
   * @param slippage Slippage tolerance
   *
   * @returns The transactions needed to withdraw the tokens
   */
  getWithdrawTX(params: {
    vaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    toToken: IToken
    slippage: IPercentage
  }): Promise<ExtendedTransactionInfo[]>

  /**
   * @method getStakedBalance
   * @description Returns the staked balance of a user in a Fleet
   *
   * @param vaultId ID of the vault to check the balance in
   * @param user Address of the user to check the balance for
   *
   * @returns The staked balance of the user in the Fleet
   */
  getStakedBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }>

  /**
   * @method getFleetBalance
   * @description Returns the balance of a user in a Fleet
   *
   * @param vaultId ID of the vault to check the balance in
   * @param user Address of the user to check the balance for
   *
   * @returns The balance of the user in the Fleet
   */
  getFleetBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }>

  /**
   * @method getTotalBalance
   * @description Returns the total balance of a user in a Fleet
   *
   * @param vaultId ID of the vault to check the balance in
   * @param user Address of the user to check the balance for
   *
   * @returns The total balance of the user in the Fleet
   */
  getTotalBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }>
}
