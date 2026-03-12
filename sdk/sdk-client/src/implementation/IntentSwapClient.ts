import { IRPCClient } from '../interfaces/IRPCClient'
import type { RPCMainClientType } from '../rpc/SDKMainClient'
import type { IIntentSwapClient } from '../interfaces/IIntentSwapClient'
import {
  OrderSigningUtils,
  type SupportedChainId,
  ALL_SUPPORTED_CHAIN_IDS,
  setGlobalAdapter,
  TradingSdk,
  type TradeParameters,
  type SwapAdvancedSettings,
  OrderKind,
  AdapterContext,
  type OrderPostingResult,
} from '@cowprotocol/cow-sdk'
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter'

import type { SDKSigner } from './MakeSDKWithSigner'
import { LoggingService, Price } from '@summerfi/sdk-common'

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

    const adapter = new ViemAdapter({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      provider: params.publicClient as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      signer: params.account as any,
    })
    AdapterContext.getInstance().setAdapter(adapter)

    const signingResult = await OrderSigningUtils.signOrder(
      params.order,
      params.chainId as SupportedChainId,
      adapter.signer,
    )

    return this.rpcClient.intentSwaps.sendOrder.mutate({
      sender: params.sender,
      chainId: params.chainId,
      fromAmount: params.fromAmount,
      order: params.order,
      signingResult,
    })
  }

  /* see IIntentSwapClient.sendHookOrder */
  sendHookOrder: IIntentSwapClient['sendHookOrder'] = async (params) => {
    const { chainId, account, sender, publicClient, fromAmount, toToken, postHooks, preHooks } =
      params
    // validate chainId
    this._validateChainId(chainId)

    const adapter = new ViemAdapter({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      provider: publicClient as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      signer: account as any,
    })
    AdapterContext.getInstance().setAdapter(adapter)

    const sdk = new TradingSdk(
      {
        chainId: chainId as SupportedChainId,
        appCode: 'summerfi-sdk',
      },
      {},
      adapter,
    )

    // approval
    const isErc20 = fromAmount.token.symbol !== 'ETH'
    if (isErc20) {
      const fromTokenAddress = fromAmount.token.address.toSolidityValue()
      const currentAllowance = await sdk.getCowProtocolAllowance({
        tokenAddress: fromTokenAddress,
        owner: sender.toSolidityValue(),
      })
      const requiredAmount = fromAmount.toSolidityValue()
      // Only approve if needed
      if (currentAllowance < requiredAmount) {
        const txHash = await sdk.approveCowProtocol({
          tokenAddress: fromTokenAddress,
          amount: requiredAmount,
        })
        LoggingService.debug('Swap: approval transaction:', txHash)
      } else {
        LoggingService.debug('Swap: sufficient allowance already exists. Skipping approval.')
      }
    }

    const parameters: TradeParameters = {
      kind: OrderKind.SELL,
      sellToken: fromAmount.token.address.toSolidityValue(),
      sellTokenDecimals: fromAmount.token.decimals,
      buyToken: toToken.address.toSolidityValue(),
      buyTokenDecimals: toToken.decimals,
      amount: fromAmount.toSolidityValue().toString(),
    }
    LoggingService.debug('Swap: trade parameters', parameters)

    const advancedSettings: SwapAdvancedSettings = {
      appData: {
        metadata: {
          hooks: {
            pre: preHooks,
            post: postHooks,
          },
        },
      },
    }

    let orderPostResult: OrderPostingResult
    try {
      orderPostResult = await sdk.postSwapOrder(parameters, advancedSettings)
    } catch (error) {
      LoggingService.error('Error posting swap order:', error)
      throw error
    }

    const orderId = orderPostResult.orderId

    return { status: 'order_sent', orderId }
  }

  /** @see IIntentSwapClient.cancelOrder */
  cancelOrder: IIntentSwapClient['cancelOrder'] = async (params) => {
    // validate chainId
    this._validateChainId(params.chainId)

    const adapter = new ViemAdapter({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      provider: params.publicClient as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      signer: params.account as any,
    })
    AdapterContext.getInstance().setAdapter(adapter)

    const orderCancellationsSigningResult = await OrderSigningUtils.signOrderCancellation(
      params.orderId,
      params.chainId as SupportedChainId,
      adapter.signer,
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
