import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import {
  Address,
  TokenAmount,
  ChainId,
  SwapErrorType,
  isChainId,
  IntentSwapProviderType,
  Price,
  type ITokenAmount,
} from '@summerfi/sdk-common'
import { ManagerProviderBase } from '@summerfi/sdk-server-common'
import { type IIntentSwapProvider } from '@summerfi/swap-common'
import {
  OrderBookApi,
  SupportedChainId,
  OrderQuoteRequest,
  OrderQuoteSideKindSell,
  ALL_SUPPORTED_CHAIN_IDS,
  type UnsignedOrder,
  SigningScheme,
  COW_PROTOCOL_SETTLEMENT_CONTRACT_ADDRESS,
  ETH_FLOW_ADDRESS,
} from '@cowprotocol/cow-sdk'
import { encodeFunctionData } from 'viem'
import { invalidateOrderAbi } from './invalidateOrderAbi'
import { BigNumber } from 'bignumber.js'

export class CowSwapProvider
  extends ManagerProviderBase<IntentSwapProviderType>
  implements IIntentSwapProvider
{
  /**
   * =============== WARNING ===============
   * DO NOT add new url's or key's when modifying this class. Try to consolidate.
   *
   * Once implementation is ready, update config and methods accordingly.
   *
   * https://docs.cow.fi/
   * */

  private readonly _supportedChainIds: SupportedChainId[]

  /** CONSTRUCTOR */

  constructor(params: { configProvider: IConfigurationProvider }) {
    super({ ...params, type: IntentSwapProviderType.CowSwap })

    this._supportedChainIds = ALL_SUPPORTED_CHAIN_IDS.filter((chainId) =>
      isChainId(chainId),
    ) as SupportedChainId[]
  }

  /** PUBLIC */
  /** @see IManagerProvider.getSupportedChainIds */
  getSupportedChainIds(): ChainId[] {
    return this._supportedChainIds as ChainId[]
  }

  /** @see IIntentSwapProvider.getSellOrderQuote */
  async getSellOrderQuote(
    params: Parameters<IIntentSwapProvider['getSellOrderQuote']>[0],
  ): ReturnType<IIntentSwapProvider['getSellOrderQuote']> {
    const chainId = params.fromAmount.token.chainInfo.chainId
    const supportedChainId = this._assertSupportedChainId(chainId)

    const orderBookApi = new OrderBookApi({ chainId: supportedChainId })

    const sellToken = params.fromAmount.token.address.value
    const sellAmount = params.fromAmount.toSolidityValue().toString()
    const buyToken = params.toToken.address.value
    const from = params.from.value
    // If receiver is not provided, use the from address as the receiver
    const receiver = params.receiver?.value ?? params.from.value

    const quoteRequest: OrderQuoteRequest = {
      sellToken,
      buyToken,
      sellAmountBeforeFee: sellAmount,
      kind: OrderQuoteSideKindSell.SELL,
      from,
      receiver,
    }

    const { quote } = await orderBookApi.getQuote(quoteRequest)

    const order: UnsignedOrder = {
      ...quote,
      receiver,
      sellAmount,
      // CowSwap protocol does not require a feeAmount to be set; it is always '0' for CowSwap orders.
      // This field is included only to satisfy the UnsignedOrder type/interface.
      feeAmount: '0',
      partiallyFillable: params.partiallyFillable ?? false,
    }

    console.log('Selling:', params.fromAmount.toString())
    let buyAmount = TokenAmount.createFromBaseUnit({
      token: params.toToken,
      amount: quote.buyAmount,
    })

    if (params.limitPrice) {
      const quotePrice = Price.createFrom({
        value: new BigNumber(buyAmount.amount).dividedBy(params.fromAmount.amount).toString(),
        base: params.fromAmount.token,
        quote: params.toToken,
      })
      console.log('Quote buy amount:', buyAmount.toString())
      console.log('Quote Price:', quotePrice.toString())
      console.log('Limit Price:', params.limitPrice.toString())

      // Calculate new buy amount for the given limit price
      // newBuyAmount = fromAmount * limitPrice
      const newBuyAmount: ITokenAmount = params.fromAmount.multiply(params.limitPrice)
      console.log('Limit buy amount:', newBuyAmount.toString())

      order.buyAmount = newBuyAmount.toSolidityValue().toString()
      buyAmount = newBuyAmount
    }

    return {
      providerType: IntentSwapProviderType.CowSwap,
      fromTokenAmount: params.fromAmount,
      toTokenAmount: buyAmount,
      validTo: quote.validTo,
      order,
    }
  }

  async sendOrder(
    params: Parameters<IIntentSwapProvider['sendOrder']>[0],
  ): ReturnType<IIntentSwapProvider['sendOrder']> {
    const { chainId, order, signingResult } = params
    const supportedChainId = this._assertSupportedChainId(chainId)

    const orderBookApi = new OrderBookApi({ chainId: supportedChainId })

    const orderId = await orderBookApi.sendOrder({
      ...order,
      ...signingResult,
      signature: signingResult.signature,
      signingScheme: signingResult.signingScheme as unknown as SigningScheme,
    })

    return {
      orderId: orderId,
    }
  }

  async cancelOrder(
    params: Parameters<IIntentSwapProvider['cancelOrder']>[0],
  ): ReturnType<IIntentSwapProvider['cancelOrder']> {
    const { chainId, orderId, signingResult } = params
    const supportedChainId = this._assertSupportedChainId(chainId)

    const orderBookApi = new OrderBookApi({ chainId: supportedChainId })

    const orderUids = [orderId]

    try {
      const cancellationsResult = await orderBookApi.sendSignedOrderCancellations({
        ...signingResult,
        orderUids,
      })

      const result = cancellationsResult + ' order(s) ' + orderUids.join(', ')

      return { result }
    } catch (e) {
      throw new Error(
        `Failed to cancel order(s) ${orderUids.join(', ')}: ${this._parseErrorType()}`,
      )
    }
  }

  async cancelOrderOnchain(
    params: Parameters<IIntentSwapProvider['cancelOrderOnchain']>[0],
  ): ReturnType<IIntentSwapProvider['cancelOrderOnchain']> {
    const { orderId, chainId } = params
    const supportedChainId = this._assertSupportedChainId(chainId)

    const settlementAddress = this._getCowAddress(supportedChainId, 'settlement')

    // encode invalidateOrder function call
    const calldata = encodeFunctionData({
      abi: invalidateOrderAbi,
      functionName: 'invalidateOrder',
      args: [orderId],
    })

    return {
      description: `Cancel CowSwap order with ID ${orderId}`,
      transaction: {
        target: settlementAddress,
        value: '0',
        calldata,
      },
    }
  }

  async checkOrder(
    params: Parameters<IIntentSwapProvider['checkOrder']>[0],
  ): ReturnType<IIntentSwapProvider['checkOrder']> {
    const { orderId, chainId } = params
    const supportedChainId = this._assertSupportedChainId(chainId)

    const orderBookApi = new OrderBookApi({ chainId: supportedChainId })

    // fetch two promises in parallel
    const [order /**trades*/] = await Promise.all([
      orderBookApi.getOrder(orderId),
      orderBookApi.getTrades({ orderUid: orderId }),
    ])

    if (!order) {
      return null
    }
    return {
      order,
    }
  }

  /** PRIVATE */

  /**
   * @description Tries to parse the error message from CowSwap to provide a higher level error type
   * @param errorDescription The error description from CowSwap
   * @returns The parsed error type
   */
  private _parseErrorType(): SwapErrorType {
    return SwapErrorType.Unknown
  }

  /**
   * Maps a ChainId to a SupportedChainId
   * @param chainId The ChainId to map
   * @returns The SupportedChainId
   */
  private _assertSupportedChainId(chainId: ChainId): SupportedChainId {
    if (!this.getSupportedChainIds().includes(chainId)) {
      throw new Error(`Chain ID ${chainId} is not supported by CowSwapProvider`)
    }
    return chainId as SupportedChainId
  }

  // Add helper to centralize settlement‐address logic
  private _getCowAddress(
    supportedChainId: SupportedChainId,
    type: 'settlement' | 'eth_flow',
  ): Address {
    let value: string
    switch (type) {
      case 'settlement':
        value = COW_PROTOCOL_SETTLEMENT_CONTRACT_ADDRESS[supportedChainId]
        break
      case 'eth_flow':
        value = ETH_FLOW_ADDRESS[supportedChainId]
        break
      default:
        throw new Error(`Unknown CowSwap address type: ${type}`)
    }
    return Address.createFromEthereum({
      value,
    })
  }
}
