import type {
  AddressValue,
  ApproveTransactionInfo,
  ChainId,
  IAddress,
  IChainInfo,
  ITokenAmount,
  Permit2AuthorizationTransactionInfo,
  Permit2PermitData,
  Permit2RevokeTransactionInfo,
  Permit2SubAllowanceTransactionInfo,
} from '@summerfi/sdk-common'
import type { SignTypedDataParameters } from 'viem'

/**
 * @name IAllowanceManager
 * @description Interface for the Allowance Manager which handles generating transactions for setting an allowance
 */
export interface IAllowanceManager {
  /**
   * @name getApproval
   * @description Get the transactions needed to set an allowance for a token
   *
   * @param chainInfo Chain in which the token is
   * @param spender Address of the spender to approve
   * @param amount Amount of tokens to allow the spender to spend
   * @param owner (optional) Address of the owner of the tokens. If not provided, it will not check the current allowance and will always return the approval transaction
   *
   * @returns The transaction info needed to set the allowance, or undefined if no approval is needed (owner param is required for this)
   */
  getApproval(params: {
    chainInfo: IChainInfo
    spender: IAddress
    amount: ITokenAmount
    owner?: IAddress
  }): Promise<ApproveTransactionInfo | undefined>

  /**
   * @name getApprovalFromBaseUnit
   * @description Base-unit convenience variant of {@link getApproval}. Accepts primitive
   * arguments (chainId, address values, a base-unit bigint) instead of value objects, so callers
   * holding a raw amount don't have to hand-build a Token/TokenAmount just to request an approval.
   *
   * @param chainId Chain in which the token is
   * @param spenderAddress Address of the spender to approve
   * @param tokenAddress Address of the ERC-20 token to approve
   * @param amount Amount of tokens (in token base units) to allow the spender to spend
   * @param ownerAddress (optional) Owner of the tokens. If not provided, the current allowance is
   * not checked and the approval transaction is always returned
   *
   * @returns The transaction info needed to set the allowance, or undefined if no approval is
   * needed (ownerAddress param is required for this)
   */
  getApprovalFromBaseUnit(params: {
    chainId: ChainId
    spenderAddress: AddressValue
    tokenAddress: AddressValue
    amount: bigint
    ownerAddress?: AddressValue
  }): Promise<ApproveTransactionInfo | undefined>

  /**
   * @name isPermit2AuthorizationNeeded
   * @description Checks if the Permit2 contract needs authorization for a specific token and amount
   * @param chainId The chain ID to check the allowance on
   * @param ownerAddress The token owner's address
   * @param tokenAddress The ERC-20 token address to check authorization for
   * @param amount The required amount (in token base units) to check against the current allowance
   * @returns True if the current Permit2 allowance is less than the required amount
   */
  isPermit2AuthorizationNeeded(params: {
    chainId: ChainId
    ownerAddress: IAddress
    tokenAddress: IAddress
    amount: bigint
  }): Promise<boolean>

  /**
   * @name getPermit2AuthorizationTx
   * @description Creates a transaction to authorize the Permit2 contract to spend a specific token
   * @param chainId The chain ID where the token lives
   * @param tokenAddress The ERC-20 token address to authorize
   * @returns A TransactionInfo for the approve(Permit2, MaxUint256) transaction
   */
  getPermit2AuthorizationTx(params: {
    chainId: ChainId
    tokenAddress: IAddress
  }): [Permit2AuthorizationTransactionInfo]

  /**
   * @name getPermit2SubAllowanceTx
   * @description Creates a transaction granting a spender a Permit2 sub-allowance for a token via
   * `PERMIT2.approve(token, spender, amount, expiration)` — the recurring Permit2 `AllowanceTransfer`
   * allowance the spender draws down (e.g. the DCA keeper pulling source-vault shares each trade).
   * Requires a prior ERC-20 authorization of Permit2 for the token (see {@link getPermit2AuthorizationTx}).
   * @param chainId The chain ID where the token lives
   * @param tokenAddress The ERC-20 token address the sub-allowance is granted on
   * @param spenderAddress The address authorized to pull the token via Permit2
   * @param amount The sub-allowance amount (must fit in uint160)
   * @param expiration Unix-seconds expiration of the sub-allowance (must fit in uint48)
   * @returns A TransactionInfo for the `PERMIT2.approve(token, spender, amount, expiration)` transaction
   */
  getPermit2SubAllowanceTx(params: {
    chainId: ChainId
    tokenAddress: IAddress
    spenderAddress: IAddress
    amount: bigint
    expiration: number
  }): [Permit2SubAllowanceTransactionInfo]

  /**
   * @name isPermit2SubAllowanceNeeded
   * @description Checks whether the spender's current Permit2 sub-allowance for a token is
   * insufficient — reads the `PERMIT2.allowance(owner, token, spender)` ledger and returns true when
   * the granted amount is below `amount` OR the allowance has expired (or was never set). Use to
   * decide whether to prepend a {@link getPermit2SubAllowanceTx} transaction.
   * @param chainId The chain ID to read the allowance on
   * @param ownerAddress The token owner's address
   * @param tokenAddress The ERC-20 token the sub-allowance is on
   * @param spenderAddress The spender the sub-allowance is granted to
   * @param amount The required amount (in token base units) to check against the current sub-allowance
   * @returns True if a fresh sub-allowance grant is needed
   */
  isPermit2SubAllowanceNeeded(params: {
    chainId: ChainId
    ownerAddress: IAddress
    tokenAddress: IAddress
    spenderAddress: IAddress
    amount: bigint
  }): Promise<boolean>

  /**
   * @name getPermit2RevokeTx
   * @description Creates a transaction to revoke the Permit2 contract authorization for a specific token
   * @param chainId The chain ID where the token lives
   * @param tokenAddress The ERC-20 token address to revoke
   * @returns A TransactionInfo for the approve(Permit2, 0) transaction
   */
  getPermit2RevokeTx(params: {
    chainId: ChainId
    tokenAddress: IAddress
  }): [Permit2RevokeTransactionInfo]

  /**
   * @name getPermit2Data
   * @description Builds the EIP-712 typed data for a PermitTransferFrom operation, ready to be signed by the caller
   * @param chainId The chain ID where the permit will be used
   * @param tokenAddress The ERC-20 token address to permit
   * @param amount The amount of tokens to permit (in token base units)
   * @param spenderAddress The address authorized to spend the tokens
   * @param senderAddress The address of the account that will sign the typed data
   * @returns The permit payload and the typed-data parameters to pass to a signTypedData call
   */
  getPermit2Data(params: {
    chainId: ChainId
    tokenAddress: AddressValue
    amount: bigint
    spenderAddress: AddressValue
    senderAddress: AddressValue
  }): {
    permitData: Permit2PermitData
    signTypedDataParameters: SignTypedDataParameters
  }
}
