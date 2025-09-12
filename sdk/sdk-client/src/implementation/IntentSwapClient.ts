import { IRPCClient } from '../interfaces/IRPCClient'
import type { RPCMainClientType } from '../rpc/SDKMainClient'
import type { IIntentSwapClient } from '../interfaces/IIntentSwapClient'
import {
  OrderSigningUtils,
  type SupportedChainId,
  ALL_SUPPORTED_CHAIN_IDS,
} from '@cowprotocol/cow-sdk'
import type { SDKSigner } from './MakeSDKWithSigner'
import { Price } from '@summerfi/sdk-common'

/**
 * @name IntentSwapClient
 * @implements IIntentSwapClient
 */
export class IntentSwapClient extends IRPCClient implements IIntentSwapClient {
  private readonly _signer: SDKSigner

  public constructor(params: { rpcClient: RPCMainClientType; signer: SDKSigner }) {
    super(params)
    this._signer = params.signer
  }

  /** @see IIntentSwapClient.getSellOrderQuote */
  public async getSellOrderQuote(
    params: Parameters<IIntentSwapClient['getSellOrderQuote']>[0],
  ): ReturnType<IIntentSwapClient['getSellOrderQuote']> {
    const limitPrice = params.limitPrice
      ? Price.createFrom({
          value: params.limitPrice,
          base: params.fromAmount.token,
          quote: params.toToken,
        })
      : undefined

    return this.rpcClient.intentSwaps.getSellOrderQuote.query({
      fromAmount: params.fromAmount,
      toToken: params.toToken,
      from: params.from,
      receiver: params.receiver,
      partiallyFillable: params.partiallyFillable,
      limitPrice,
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

    const signer = this._signer

    const signingResult = await OrderSigningUtils.signOrder(
      params.order,
      params.chainId as SupportedChainId,
      signer,
    )

    console.log(
      'Order signed with scheme:',
      signingResult.signingScheme,
      'Signature:',
      signingResult.signature,
    )

    return this.rpcClient.intentSwaps.sendOrder.mutate({
      chainId: params.chainId,
      fromAmount: params.fromAmount,
      order: params.order,
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

    const signer = this._signer

    const orderCancellationsSigningResult = await OrderSigningUtils.signOrderCancellation(
      params.orderId,
      params.chainId as SupportedChainId,
      signer,
    )

    return this.rpcClient.intentSwaps.cancelOrder.mutate({
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
