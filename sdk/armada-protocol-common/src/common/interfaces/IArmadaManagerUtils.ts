import {
  IAddress,
  IPercentage,
  ITokenAmount,
  type IArmadaPosition,
  type IArmadaPositionId,
  type IArmadaVaultId,
  type IChainInfo,
  type IToken,
  IUser,
  type TransactionPriceImpact,
  type HexData,
} from '@summerfi/sdk-common'
import type {
  GetGlobalRebalancesQuery,
  GetVaultQuery,
  GetVaultsQuery,
  GetUsersActivityQuery,
  GetUserActivityQuery,
  Position_Filter,
} from '@summerfi/subgraph-manager-common'
/**
 * @name IArmadaManagerUtils
 * @description Interface for the Armada Protocol Manager which handles generating transactions for a Fleet
 */
export interface IArmadaManagerUtils {
  /**
   * @method getSummerToken
   * @description Retrieves the Summer token for a given chain
   *
   * @param chainInfo Chain information
   *
   * @returns The Summer token for the given chain
   */
  getSummerToken: (params: { chainInfo: IChainInfo }) => IToken

  /** POSITIONS */

  /**
   * @name getUserPositions
   * @description Get all user positions in all fleets
   *
   * @param user target user
   *
   * @returns IArmadaPosition[]
   */
  getUserPositions(params: { user: IUser }): Promise<IArmadaPosition[]>

  /**
   * @name getUserBalance
   * @description Get user position in the fleet
   *
   * @param user target user
   * @param fleetAddress Address of the fleet
   *
   * @returns IArmadaPosition
   */
  getUserPosition(params: {
    user: IUser
    fleetAddress: IAddress
  }): Promise<IArmadaPosition | undefined>

  /**
   * @name getPosition
   * @description Get the position of a user in the specified fleet
   *
   * @param positionId ID of the position to retrieve
   *
   * @returns IArmadaPosition The position of the user in the fleet
   *
   */
  getPosition(params: { positionId: IArmadaPositionId }): Promise<IArmadaPosition | undefined>

  /** VAULT */

  /**
   * @name getVaultsRaw
   * @description Get all vaults in the protocol
   *
   * @param chainInfo Chain information
   *
   * @returns GetVaultsQuery
   */
  getVaultsRaw(params: { chainInfo: IChainInfo }): Promise<GetVaultsQuery>

  /**
   * @name getVaultRaw
   * @description Get the specific vault in the protocol
   *
   * @param vaultId ID of the pool to retrieve
   *
   * @returns GetVaultQuery
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
  getGlobalRebalancesRaw(params: { chainInfo: IChainInfo }): Promise<GetGlobalRebalancesQuery>

  /**
   * @name getUsersActivityRaw
   * @description Get all users activity per given chain
   *
   * @param chainInfo Chain information
   *
   * @returns GerUsersActivityQuery
   */
  getUsersActivityRaw(params: {
    chainInfo: IChainInfo
    where?: Position_Filter
  }): Promise<GetUsersActivityQuery>

  /**
   * @name getUserActivityRaw
   * @description Get all user activity per given chain
   *
   * @param chainInfo Chain information
   *
   * @returns GerUsersActivityQuery
   */
  getUserActivityRaw(params: {
    vaultId: IArmadaVaultId
    accountAddress: string
  }): Promise<GetUserActivityQuery>

  /**
   * @name getFleetShares
   */
  getFleetShares(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<ITokenAmount>

  /**
   * @name getStakedShares
   */
  getStakedShares(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<ITokenAmount>

  /**
   * @name getFleetBalance
   * @description Get the balance of a user in a fleet
   *
   * @param vaultId ID of the pool to retrieve the shares
   * @param user Address of the user to retrieve the shares
   *
   * @returns ITokenAmount The amount of assets the user has in the fleet
   */
  getFleetBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }>

  /**
   * @name getStakedBalance
   * @description Get the staked balance of a user in a rewards pool
   *
   * @param vaultId ID of the vault to retrieve the balance
   * @param user Address of the user to retrieve the balance
   *
   * @returns ITokenAmount The amount of assets the user has staked
   */
  getStakedBalance(params: {
    vaultId: IArmadaVaultId
    user: IUser
  }): Promise<{ shares: ITokenAmount; assets: ITokenAmount }>

  /**
   *
   * @name getTotalBalance
   * @description Get the total balance of a user in a fleet
   *
   * @param vaultId ID of the pool to retrieve the shares
   * @param user Address of the user to retrieve the shares
   *
   * @returns ITokenAmount The total amount of assets the user has in the fleet
   */
  getTotalBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }>

  /** UTILITY FUNCTIONS */

  /**
   * @name convertToShares
   * @description Converts a token amount to shares in the Fleet
   *
   * @param vaultId ID of the vault to convert the tokens to shares
   * @param amount Token amount to be converted
   *
   * @returns ITokenAmount The amount of shares that the token amount represents
   */
  convertToShares(params: { vaultId: IArmadaVaultId; amount: ITokenAmount }): Promise<ITokenAmount>

  /**
   * @name convertToAssets
   * @description Converts shares to token amount in the Fleet
   *
   * @param vaultId ID of the vault to convert the tokens to shares
   * @param amount Token amount to be converted
   *
   * @returns ITokenAmount The amount of token that the shares represents
   */
  convertToAssets(params: { vaultId: IArmadaVaultId; amount: ITokenAmount }): Promise<ITokenAmount>

  /**
   * @name getSwapCall
   * @description Get the swap call for a given vault
   *
   * @param vaultId ID of the vault to swap
   * @param fromAmount Amount of tokens to swap
   * @param toToken Token to swap to
   * @param slippage Slippage percentage
   *
   * @returns The swap call data, minimum amount and to amount
   */
  getSwapCall(params: {
    vaultId: IArmadaVaultId
    fromAmount: ITokenAmount
    toToken: IToken
    slippage: IPercentage
  }): Promise<{
    calldata: HexData
    minAmount: ITokenAmount
    toAmount: ITokenAmount
  }>

  /**
   * @name getPriceImpact
   * @description Get the price impact of a swap
   *
   * @param fromAmount The amount of tokens to swap
   * @param toAmount The amount of tokens to receive
   *
   * @returns TransactionPriceImpact The price impact of the swap
   */
  getPriceImpact(params: {
    fromAmount: ITokenAmount
    toAmount: ITokenAmount
  }): Promise<TransactionPriceImpact>
}
