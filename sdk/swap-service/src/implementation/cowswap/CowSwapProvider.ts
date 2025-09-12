import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import type { ITokensManager } from '@summerfi/tokens-common'
import {
  Address,
  TokenAmount,
  ChainId,
  SwapErrorType,
  isChainId,
  IntentSwapProviderType,
  Price,
  type ITokenAmount,
  getChainInfoByChainId,
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
  ETH_FLOW_ADDRESSES,
  WRAPPED_NATIVE_CURRENCIES,
  COW_PROTOCOL_VAULT_RELAYER_ADDRESS,
  NATIVE_CURRENCY_ADDRESS,
} from '@cowprotocol/cow-sdk'
import { encodeFunctionData } from 'viem'
import { invalidateOrderAbi } from './invalidateOrderAbi'
import { BigNumber } from 'bignumber.js'
import { LoggingService } from 'node_modules/@summerfi/sdk-common/dist'

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
  private readonly _allowanceManager: IAllowanceManager
  private readonly _tokensManager: ITokensManager

  /** CONSTRUCTOR */

  constructor(params: {
    configProvider: IConfigurationProvider
    allowanceManager: IAllowanceManager
    tokensManager: ITokensManager
  }) {
    super({ ...params, type: IntentSwapProviderType.CowSwap })

    this._allowanceManager = params.allowanceManager
    this._tokensManager = params.tokensManager
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

    // if ETH is being sold, use the wrapped version
    let sellTokenAddress
    if (params.fromAmount.token.address.value === NATIVE_CURRENCY_ADDRESS) {
      sellTokenAddress = WRAPPED_NATIVE_CURRENCIES[supportedChainId].address
    } else {
      sellTokenAddress = params.fromAmount.token.address.value
    }
    const buyTokenAddress = params.toToken.address.value

    const sellAmount = params.fromAmount.toSolidityValue().toString()
    const from = params.from.value
    // If receiver is not provided, use the from address as the receiver
    const receiver = params.receiver?.value ?? params.from.value

    const quoteRequest: OrderQuoteRequest = {
      sellToken: sellTokenAddress,
      buyToken: buyTokenAddress,
      sellAmountBeforeFee: sellAmount,
      kind: OrderQuoteSideKindSell.SELL,
      from,
      receiver,
    }

    const orderBookApi = new OrderBookApi({ chainId: supportedChainId })
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

    let buyAmount = TokenAmount.createFromBaseUnit({
      token: params.toToken,
      amount: quote.buyAmount,
    })

    const quotePrice = Price.createFrom({
      value: new BigNumber(buyAmount.amount).dividedBy(params.fromAmount.amount).toString(),
      base: params.fromAmount.token,
      quote: params.toToken,
    })
    LoggingService.debug(
      'Selling:',
      params.fromAmount.toString(),
      '\nQuote buy amount:',
      buyAmount.toString(),
      '\nQuote price:',
      quotePrice.toString(),
    )

    if (params.limitPrice) {
      // Calculate new buy amount for the given limit price
      // newBuyAmount = fromAmount * limitPrice
      const newBuyAmount: ITokenAmount = params.fromAmount.multiply(params.limitPrice)
      LoggingService.debug(
        'Limit price:',
        params.limitPrice.toString(),
        '\nLimit buy amount:',
        newBuyAmount.toString(),
      )

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
    const chainInfo = getChainInfoByChainId(supportedChainId)

    // check if the from token is native token
    if (
      params.fromAmount.token.address.value.toLowerCase() === NATIVE_CURRENCY_ADDRESS.toLowerCase()
    ) {
      const wrappedNativeCurrencyAddress = WRAPPED_NATIVE_CURRENCIES[supportedChainId].address
      // check balance for wrapped token

      // check balance using tokens manager
      const wrappedNativeCurrencyBalance = await this._tokensManager.getTokenBalanceByAddress({
        chainInfo,
        address: Address.createFromEthereum({ value: wrappedNativeCurrencyAddress }),
        walletAddress: Address.createFromEthereum({ value: order.receiver }),
      })
      if (BigInt(wrappedNativeCurrencyBalance.amount) < BigInt(order.sellAmount)) {
        // insufficient wrapped native currency balance to cover the sell amount
        // need to wrap more native currency
        // check native currency balance using tokens manager
        const nativeCurrencyBalance = await this._tokensManager.getTokenBalanceByAddress({
          chainInfo,
          address: Address.createFromEthereum({ value: NATIVE_CURRENCY_ADDRESS }),
          walletAddress: Address.createFromEthereum({ value: order.receiver }),
        })
        if (
          BigInt(nativeCurrencyBalance.amount) + BigInt(wrappedNativeCurrencyBalance.amount) <
          BigInt(order.sellAmount)
        ) {
          throw new Error(
            `Insufficient native currency balance to wrap to cover the sell amount. Need at least ${BigInt(order.sellAmount) - BigInt(wrappedNativeCurrencyBalance.amount)} of native currency to wrap.`,
          )
        } else {
          // need to wrap some native currency using viem
          const wethAbi = [
            {
              type: 'function',
              name: 'deposit',
              stateMutability: 'payable',
              inputs: [],
              outputs: [],
            },
          ] as const

          return {
            status: 'wrap_to_native',
            transactionInfo: {
              transaction: {
                target: Address.createFromEthereum({ value: wrappedNativeCurrencyAddress }),
                calldata: encodeFunctionData({
                  abi: wethAbi,
                  functionName: 'deposit',
                }),
                value: (
                  BigInt(order.sellAmount) - BigInt(wrappedNativeCurrencyBalance.amount)
                ).toString(),
              },
              description: `Wrap ${(BigInt(order.sellAmount) - BigInt(wrappedNativeCurrencyBalance.amount)).toString()} of native currency to cover CowSwap order sell amount`,
            },
          }
        }
      }
    }

    const sellTokenAddress = Address.createFromEthereum({ value: order.sellToken })
    const sellToken = this._tokensManager.getTokenByAddress({
      chainInfo,
      address: sellTokenAddress,
    })

    // Create token amount from sell amount
    const sellAmount = TokenAmount.createFromBaseUnit({
      token: sellToken,
      amount: order.sellAmount,
    })

    // Check if approval is needed
    const approval = await this._allowanceManager.getApproval({
      chainInfo: sellToken.chainInfo,
      spender: this._getCowAddress(supportedChainId, 'relayer'),
      amount: sellAmount,
    })

    if (approval) {
      return {
        status: 'allowance_needed',
        transactionInfo: approval,
      }
    }

    const orderBookApi = new OrderBookApi({ chainId: supportedChainId })

    try {
      const orderId = await orderBookApi.sendOrder({
        ...order,
        ...signingResult,
        signature: signingResult.signature,
        signingScheme: signingResult.signingScheme as unknown as SigningScheme,
      })

      return {
        status: 'order_sent',
        orderId: orderId,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error('Error sending order to CowSwap:', e?.body?.errorType)
      throw new Error(`Failed to send order: ${e?.body?.errorType}`)
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

  // Add helper to centralize settlement-address logic
  private _getCowAddress(
    supportedChainId: SupportedChainId,
    type: 'settlement' | 'eth_flow' | 'relayer',
  ): Address {
    let value: string
    switch (type) {
      case 'settlement':
        value = COW_PROTOCOL_SETTLEMENT_CONTRACT_ADDRESS[supportedChainId]
        break
      case 'eth_flow':
        value = ETH_FLOW_ADDRESSES[supportedChainId]
        break
      case 'relayer':
        value = COW_PROTOCOL_VAULT_RELAYER_ADDRESS[supportedChainId]
        break
      default:
        throw new Error(`Unknown CowSwap address type: ${type}`)
    }
    return Address.createFromEthereum({
      value,
    })
  }
}
