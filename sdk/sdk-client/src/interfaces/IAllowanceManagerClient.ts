import type {
  AddressValue,
  ApproveTransactionInfo,
  ChainId,
  ITokenAmount,
  Permit2AuthorizationTransactionInfo,
  Permit2PermitData,
  Permit2RevokeTransactionInfo,
} from '@summerfi/sdk-common'
import type { SignTypedDataParameters } from 'viem'

/**
 * Client-side surface for the allowance manager. Every method is a thin wrapper over a
 * server tRPC procedure — all logic and onchain reads happen server-side.
 */
export interface IAllowanceManagerClient {
  /**
   * Get the transaction needed to set an ERC-20 allowance for a spender, or undefined
   * if the owner already has a sufficient allowance (owner must be provided for that check).
   */
  getApproval(params: {
    chainId: ChainId
    spender: AddressValue
    amount: ITokenAmount
    owner?: AddressValue
  }): Promise<ApproveTransactionInfo | undefined>

  /**
   * Checks if the Permit2 contract needs authorization for a specific token and amount
   */
  isPermit2AuthorizationNeeded(params: {
    chainId: ChainId
    ownerAddress: AddressValue
    tokenAddress: AddressValue
    amount: bigint
  }): Promise<boolean>

  /**
   * Creates a transaction to authorize the Permit2 contract to spend a specific token
   */
  getPermit2AuthorizationTx(params: {
    chainId: ChainId
    tokenAddress: AddressValue
  }): Promise<[Permit2AuthorizationTransactionInfo]>

  /**
   * Creates a transaction to revoke the Permit2 contract authorization for a specific token
   */
  getPermit2RevokeTx(params: {
    chainId: ChainId
    tokenAddress: AddressValue
  }): Promise<[Permit2RevokeTransactionInfo]>

  /**
   * Builds the EIP-712 typed data for a PermitTransferFrom operation, ready to be signed by the caller
   */
  getPermit2Data(params: {
    chainId: ChainId
    tokenAddress: AddressValue
    amount: bigint
    spenderAddress: AddressValue
    senderAddress: AddressValue
  }): Promise<{
    permitData: Permit2PermitData
    signTypedDataParameters: SignTypedDataParameters
  }>
}
