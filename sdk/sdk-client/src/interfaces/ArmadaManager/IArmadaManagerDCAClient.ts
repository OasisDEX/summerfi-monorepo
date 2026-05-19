import type {
  AddressValue,
  ArmadaDcaOrderStatusEnum,
  ChainId,
  HexData,
  IArmadaDcaOrder,
  ITokenAmount,
} from '@summerfi/sdk-common'
import type { Account, SignTypedDataParameters } from 'viem'

/**
 * @name IArmadaManagerDCAClient
 * @description Client interface for Armada DCA order management
 */
export interface IArmadaManagerDCAClient {
  createAndSaveBuyOrder(params: {
    userAddress: AddressValue
    chainId: ChainId
    fromVault: AddressValue
    toVault: AddressValue
    signTypedData: (params: SignTypedDataParameters) => Promise<`0x${string}`>
    amount: ITokenAmount
    /** Slippage as a percentage (e.g. "0.5" for 0.5%) */
    slippagePercentage: string
    intervalSeconds: number
    /** Unix timestamp of the first scheduled execution */
    firstExecutionUnixTimestamp: number
    /** Unix timestamp after which the order stops executing (optional) */
    deadlineUnixTimestamp?: number
    /** Maximum number of trades to execute before the order completes */
    maxTrades: number
    /** Price ceiling — skip execution if the fromVault token price is above this value (optional) */
    neverBuyAbove?: string
    /** Price floor — skip execution if the toVault token price is below this value (optional) */
    neverSellBelow?: string
  }): Promise<IArmadaDcaOrder>

  getBuyOrder(params: {
    orderId: string
    userAddress: AddressValue
  }): Promise<IArmadaDcaOrder | undefined>

  getBuyOrders(params: {
    userAddress: AddressValue
    chainId?: ChainId
    status?: ArmadaDcaOrderStatusEnum
  }): Promise<IArmadaDcaOrder[]>

  cancelBuyOrder(params: {
    orderId: string
    userAddress: AddressValue
    signedMessage: string
    signature: HexData
  }): Promise<IArmadaDcaOrder>

  pauseBuyOrder(params: {
    orderId: string
    userAddress: AddressValue
    signedMessage: string
    signature: HexData
  }): Promise<IArmadaDcaOrder>

  resumeBuyOrder(params: {
    orderId: string
    userAddress: AddressValue
    signedMessage: string
    signature: HexData
  }): Promise<IArmadaDcaOrder>
}
