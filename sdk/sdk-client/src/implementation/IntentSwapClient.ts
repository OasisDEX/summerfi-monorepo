import { IRPCClient } from '../interfaces/IRPCClient'
import type { RPCMainClientType } from '../rpc/SDKMainClient'
import type { IIntentSwapClient } from '../interfaces/IIntentSwapClient'
import {
  OrderSigningUtils,
  type SupportedChainId,
  ALL_SUPPORTED_CHAIN_IDS,
} from '@cowprotocol/cow-sdk'

/**
 * @name IntentSwapClient
 * @implements IIntentSwapClient
 */
export class IntentSwapClient extends IRPCClient implements IIntentSwapClient {
  public constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /** @see IIntentSwapClient.getOrderFromAmount */
  public async getOrderFromAmount(
    params: Parameters<IIntentSwapClient['getOrderFromAmount']>[0],
  ): ReturnType<IIntentSwapClient['getOrderFromAmount']> {
    return this.rpcClient.intentSwaps.getOrderFromAmount.query({
      fromAmount: params.fromAmount,
      toToken: params.toToken,
      from: params.from,
      receiver: params.receiver,
      partiallyFillable: params.partiallyFillable,
    })
  }

  /** @see IIntentSwapClient.sendOrder */
  public async sendOrder(
    params: Parameters<IIntentSwapClient['sendOrder']>[0],
  ): ReturnType<IIntentSwapClient['sendOrder']> {
    // validate chainId
    if (!ALL_SUPPORTED_CHAIN_IDS.includes(params.chainId as SupportedChainId)) {
      throw new Error(`Unsupported chainId: ${params.chainId}`)
    }

    const signer = provider.getSigner()
    const signingResult = await OrderSigningUtils.signOrder(
      params.order,
      params.chainId as SupportedChainId,
      signer,
    )

    return this.rpcClient.intentSwaps.sendOrder.query({
      chainId: params.chainId,
      signingResult,
    })
  }

  /** @see IIntentSwapClient.cancelOrder */
  public async cancelOrder(
    params: Parameters<IIntentSwapClient['cancelOrder']>[0],
  ): ReturnType<IIntentSwapClient['cancelOrder']> {
    // validate chainId
    if (!ALL_SUPPORTED_CHAIN_IDS.includes(params.chainId as SupportedChainId)) {
      throw new Error(`Unsupported chainId: ${params.chainId}`)
    }
    const signer = provider.getSigner()

    const orderCancellationsSigningResult = await OrderSigningUtils.signOrderCancellation(
      params.orderId,
      params.chainId as SupportedChainId,
      signer,
    )

    return this.rpcClient.intentSwaps.cancelOrder.query({
      chainId: params.chainId,
      orderId: params.orderId,
      signingResult: orderCancellationsSigningResult,
    })
  }

  /** @see IIntentSwapClient.checkOrder */
  public async checkOrder(
    params: Parameters<IIntentSwapClient['checkOrder']>[0],
  ): ReturnType<IIntentSwapClient['checkOrder']> {
    // validate chainId
    if (!ALL_SUPPORTED_CHAIN_IDS.includes(params.chainId as SupportedChainId)) {
      throw new Error(`Unsupported chainId: ${params.chainId}`)
    }

    return this.rpcClient.intentSwaps.checkOrder.query({
      chainId: params.chainId,
      orderId: params.orderId,
    })
  }
}
