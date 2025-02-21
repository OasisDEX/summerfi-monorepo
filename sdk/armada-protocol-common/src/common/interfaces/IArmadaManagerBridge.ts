import type {
  IAddress,
  IUser,
  ITokenAmount,
  ChainInfo,
  BridgeTransactionInfo,
} from '@summerfi/sdk-common'

/**
 * Parameters required to generate a bridge transaction.
 */
export interface BridgeTxParams {
  /**
   * The user initiating the transaction.
   */
  user: IUser

  /**
   * The source chain information from which tokens are bridged.
   */
  sourceChain: ChainInfo

  /**
   * The target chain information to which tokens will be bridged.
   */
  targetChain: ChainInfo

  /**
   * The recipient address on the target chain.
   */
  recipient: IAddress

  /**
   * The token amount to bridge.
   */
  amount: ITokenAmount
}

/**
 * Interface for the Armada Manager Bridge.
 *
 * This interface defines the functionality required to generate transactions
 * for bridging tokens between chains.
 */
export interface IArmadaManagerBridge {
  /**
   * Generates one or more bridge transactions based on the provided parameters.
   *
   * @param params - The parameters required for creating the bridge transaction.
   * @returns A promise that resolves to an array of BridgeTransactionInfo objects.
   */
  getBridgeTx(params: BridgeTxParams): Promise<BridgeTransactionInfo[]>
}
