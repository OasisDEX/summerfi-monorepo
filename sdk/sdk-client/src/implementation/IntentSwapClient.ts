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

  private _validateChainId(chainId: number) {
    if (!ALL_SUPPORTED_CHAIN_IDS.includes(chainId as SupportedChainId)) {
      throw new Error(`Unsupported chainId: ${chainId}`)
    }
  }

  public constructor(params: { rpcClient: RPCMainClientType; signer: SDKSigner }) {
    super(params)
    this._signer = params.signer
  }

  /** @see IIntentSwapClient.getSellOrderQuote */
  getSellOrderQuote: IIntentSwapClient['getSellOrderQuote'] = async (params) => {
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
      sender: params.sender,
      receiver: params.receiver,
      partiallyFillable: params.partiallyFillable,
      limitPrice,
    })
  }

  /** @see IIntentSwapClient.sendOrder */
  sendOrder: IIntentSwapClient['sendOrder'] = async (params) => {
    // validate chainId
    this._validateChainId(params.chainId)

    const signer = this._signer

    const signingResult = await OrderSigningUtils.signOrder(
      params.order,
      params.chainId as SupportedChainId,
      signer,
    )

    return this.rpcClient.intentSwaps.sendOrder.mutate({
      sender: params.sender,
      chainId: params.chainId,
      fromAmount: params.fromAmount,
      order: params.order,
      signingResult,
    })
  }

  /** @see IIntentSwapClient.cancelOrder */
  cancelOrder: IIntentSwapClient['cancelOrder'] = async (params) => {
    // validate chainId
    this._validateChainId(params.chainId)

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
  checkOrder: IIntentSwapClient['checkOrder'] = async (params) => {
    // validate chainId
    this._validateChainId(params.chainId)

    return this.rpcClient.intentSwaps.checkOrder.query({
      chainId: params.chainId,
      orderId: params.orderId,
    })
  }
}
