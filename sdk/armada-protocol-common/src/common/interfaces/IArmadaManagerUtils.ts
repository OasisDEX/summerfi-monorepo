import {
  IAddress,
  IPercentage,
  ITokenAmount,
  type IArmadaVaultId,
  type IChainInfo,
  type IToken,
  IUser,
  type TransactionPriceImpact,
  type HexData,
  type AddressValue,
  type TransactionInfo,
  type AmountValue,
  type ChainId,
  type Erc20TransferTransactionInfo,
} from '@summerfi/sdk-common'
/**
 * @name IArmadaManagerUtils
 * @description Interface for the Armada Protocol Manager which handles generating transactions for a Fleet
 */
export interface IArmadaManagerUtils {
  /**
   * @method getSummerPrice
   * @description Retrieves the current price of the Summer token
   *
   * @param params - Optional parameters
   * @param params.override - Optional price override value
   * @returns The current price of the Summer token
   */
  getSummerPrice(params?: { override?: number }): Promise<number>

  /**
   * @method getSummerToken
   * @description Retrieves the Summer token for a given chain
   *
   * @param chainInfo Chain information
   *
   * @returns The Summer token for the given chain
   */
  getSummerToken: (params: { chainInfo: IChainInfo }) => IToken

  /** VAULT OPERATIONS */
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

  /**
   * @name getUnstakeFleetTokensTx
   * @description Get the transaction to unstake fleet tokens from the rewards manager
   *
   * @param addressValue The user address
   * @param vaultId The vault ID to unstake from (chain info is derived from vaultId.chainInfo)
   * @param amountValue Optional balance amount value to unstake (if not provided, unstakes full balance)
   *
   * @returns TransactionInfo The transaction to unstake fleet tokens
   */
  getUnstakeFleetTokensTx(params: {
    addressValue: AddressValue
    vaultId: IArmadaVaultId
    amountValue?: AmountValue
  }): Promise<TransactionInfo>

  /**
   * @name getErc20TokenTransferTx
   * @description Generates a transaction for transferring ERC20 tokens
   *
   * @param chainId Chain identifier where the token exists
   * @param tokenAddress ERC20 token contract address
   * @param recipientAddress Address to receive the tokens
   * @param amount Amount of tokens to transfer
   *
   * @returns Erc20TransferTransactionInfo Transaction information for the transfer
   */
  getErc20TokenTransferTx(params: {
    chainId: ChainId
    tokenAddress: IAddress
    recipientAddress: IAddress
    amount: ITokenAmount
  }): Promise<Erc20TransferTransactionInfo[]>
}
