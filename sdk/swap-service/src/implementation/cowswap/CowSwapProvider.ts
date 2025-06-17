import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import {
  Address,
  TokenAmount,
  ChainId,
  SwapErrorType,
  isChainId,
  IntentSwapProviderType,
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
import type { SwapProviderConfig } from '../Types'
import { encodeFunctionData } from 'viem'
import { invalidateOrderAbi } from './invalidateOrderAbi'

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
  private readonly _apiUrl: string
  private readonly _apiKey: string
  private readonly _version: string

  private readonly _supportedChainIds: SupportedChainId[]

  /** CONSTRUCTOR */

  constructor(params: { configProvider: IConfigurationProvider }) {
    super({ ...params, type: IntentSwapProviderType.CowSwap })
    // Use a config getter like OneInchSwapProvider
    const { config } = this._getConfig()
    this._apiUrl = config.apiUrl
    this._apiKey = config.apiKey
    this._version = config.version

    this._supportedChainIds = ALL_SUPPORTED_CHAIN_IDS.filter((chainId) =>
      isChainId(chainId),
    ) as SupportedChainId[]
  }

  /** PUBLIC */
  /** @see IManagerProvider.getSupportedChainIds */
  getSupportedChainIds(): ChainId[] {
    return this._supportedChainIds as ChainId[]
  }

  /** @see IIntentSwapProvider.getOrderFromAmount */
  async getOrderFromAmount(
    params: Parameters<IIntentSwapProvider['getOrderFromAmount']>[0],
  ): ReturnType<IIntentSwapProvider['getOrderFromAmount']> {
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
      sellAmountBeforeFee: sellAmount,
      buyToken,
      kind: OrderQuoteSideKindSell.SELL,
      from,
      receiver,
    }

    const { quote } = await orderBookApi.getQuote(quoteRequest)

    const order: UnsignedOrder = {
      ...quote,
      sellAmount,
      feeAmount: '0', // CowSwap does not require feeAmount
      receiver,
      partiallyFillable: params.partiallyFillable ?? false,
    }

    return {
      providerType: IntentSwapProviderType.CowSwap,
      fromTokenAmount: params.fromAmount,
      toTokenAmount: TokenAmount.createFromBaseUnit({
        token: params.toToken,
        amount: quote.buyAmount,
      }),
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

    try {
      const cancellationsResult = await orderBookApi.sendSignedOrderCancellations({
        ...signingResult,
        orderUids: [orderId],
      })

      return { result: cancellationsResult ?? 'success' }
    } catch (e) {
      throw new Error(
        `Failed to cancel CowSwap order with ID ${orderId}: ${this._parseErrorType()}`,
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
   * Gets the CowSwap configuration from the configuration provider
   * @returns The CowSwap configuration
   */
  private _getConfig(): {
    config: SwapProviderConfig
  } {
    const COW_SWAP_API_URL = this.configProvider.getConfigurationItem({ name: 'COW_SWAP_API_URL' })
    const COW_SWAP_API_KEY = this.configProvider.getConfigurationItem({ name: 'COW_SWAP_API_KEY' })
    const COW_SWAP_API_VERSION = this.configProvider.getConfigurationItem({
      name: 'COW_SWAP_API_VERSION',
    })

    if (!COW_SWAP_API_URL || !COW_SWAP_API_KEY || !COW_SWAP_API_VERSION) {
      console.error(
        JSON.stringify(
          Object.entries({
            COW_SWAP_API_URL,
            COW_SWAP_API_KEY,
            COW_SWAP_API_VERSION,
          }),
          null,
          2,
        ),
      )
      throw new Error('CowSwap configuration is missing, check logs for more information')
    }

    return {
      config: {
        apiUrl: COW_SWAP_API_URL,
        apiKey: COW_SWAP_API_KEY,
        version: COW_SWAP_API_VERSION,
        authHeader: `Bearer ${COW_SWAP_API_KEY}`,
      },
    }
  }

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
