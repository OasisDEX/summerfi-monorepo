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
  NATIVE_CURRENCY_ADDRESS_LOWERCASE,
} from '@summerfi/sdk-common'
import { ManagerProviderBase, type IManagerProvider } from '@summerfi/sdk-server-common'
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
} from '@cowprotocol/cow-sdk'
import { encodeFunctionData, formatEther } from 'viem'
import { invalidateOrderAbi } from './invalidateOrderAbi'
import { BigNumber } from 'bignumber.js'
import { LoggingService } from '@summerfi/sdk-common'
import { wrappedNativeCurrencyAbi } from './wrappedNativeCurrencyAbi'

export enum CowSwapSendOrderStatus {
  WrapToNative = 'wrap_to_native',
  AllowanceNeeded = 'allowance_needed',
  OrderSent = 'order_sent',
}

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
  getSupportedChainIds: IManagerProvider<IntentSwapProviderType>['getSupportedChainIds'] = () => {
    return this._supportedChainIds as ChainId[]
  }

  /** @see IIntentSwapProvider.getSellOrderQuote */
  getSellOrderQuote: IIntentSwapProvider['getSellOrderQuote'] = async (params) => {
    const chainId = params.fromAmount.token.chainInfo.chainId
    const supportedChainId = this._assertSupportedChainId(chainId)

    // if ETH is being sold, use the wrapped version
    let sellTokenAddress
    if (params.fromAmount.token.address.value.toLowerCase() === NATIVE_CURRENCY_ADDRESS_LOWERCASE) {
      sellTokenAddress = WRAPPED_NATIVE_CURRENCIES[supportedChainId].address
    } else {
      sellTokenAddress = params.fromAmount.token.address.value
    }
    const buyTokenAddress = params.toToken.address.value

    const sellAmount = params.fromAmount.toSolidityValue().toString()
    const from = params.sender.value
    // If receiver is not provided, use the from address as the receiver
    const receiver = params.receiver?.value ?? params.sender.value

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
      // CowSwap protocol does not charge a feeAmount; it is always '0' for CowSwap orders.
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
      const limitBuyAmount: ITokenAmount = params.fromAmount.multiply(params.limitPrice)
      LoggingService.debug(
        'With Limit price:',
        params.limitPrice.toString(),
        '\nLimit buy amount:',
        limitBuyAmount.toString(),
      )

      order.buyAmount = limitBuyAmount.toSolidityValue().toString()
      buyAmount = limitBuyAmount
    }

    return {
      providerType: IntentSwapProviderType.CowSwap,
      fromAmount: params.fromAmount,
      toAmount: buyAmount,
      validTo: quote.validTo,
      order,
    }
  }

  /** @see IIntentSwapProvider.sendOrder */
  sendOrder: IIntentSwapProvider['sendOrder'] = async (params) => {
    const { chainId, order, signingResult, sender } = params
    const supportedChainId = this._assertSupportedChainId(chainId)
    const chainInfo = getChainInfoByChainId(supportedChainId)

    // Handle native currency wrapping if needed
    if (params.fromAmount.token.address.value.toLowerCase() === NATIVE_CURRENCY_ADDRESS_LOWERCASE) {
      // check balance of wrapped native currency
      const wrappedNativeCurrencyAddress = WRAPPED_NATIVE_CURRENCIES[supportedChainId].address
      const wrappedNativeCurrencyBalance = await this._tokensManager.getTokenBalanceByAddress({
        chainInfo,
        address: Address.createFromEthereum({ value: wrappedNativeCurrencyAddress }),
        walletAddress: Address.createFromEthereum({ value: sender.value }),
      })
      LoggingService.debug({
        wrappedNativeCurrencyBalance: wrappedNativeCurrencyBalance.toString(),
        sellAmount: formatEther(BigInt(order.sellAmount)),
      })
      // if wrapped native currency balance is less than sell amount, need to wrap more
      if (BigInt(wrappedNativeCurrencyBalance.toSolidityValue()) < BigInt(order.sellAmount)) {
        // need to wrap more native currency
        // first check native currency balance to see if we have enough to wrap
        const nativeCurrencyBalance = await this._tokensManager.getTokenBalanceByAddress({
          chainInfo,
          address: Address.createFromEthereum({ value: NATIVE_CURRENCY_ADDRESS_LOWERCASE }),
          walletAddress: Address.createFromEthereum({ value: sender.value }),
        })
        LoggingService.debug({
          wrappedNativeCurrencyBalance: wrappedNativeCurrencyBalance.toString(),
          nativeCurrencyBalance: nativeCurrencyBalance.toString(),
          sellAmount: formatEther(BigInt(order.sellAmount)),
        })
        // if native currency balance + wrapped native currency balance < sell amount, cannot wrap enough
        if (
          BigInt(nativeCurrencyBalance.toSolidityValue()) +
            BigInt(wrappedNativeCurrencyBalance.toSolidityValue()) <
          BigInt(order.sellAmount)
        ) {
          throw new Error(
            `Insufficient native currency balance to wrap to cover the sell amount. Need at least ${formatEther(BigInt(order.sellAmount) - BigInt(wrappedNativeCurrencyBalance.toSolidityValue()))} of native currency to wrap.`,
          )
        } else {
          // return transaction info to wrap required amount of native currency
          // amount to wrap = sell amount - wrapped native currency balance

          return {
            status: CowSwapSendOrderStatus.WrapToNative,
            transactionInfo: {
              transaction: {
                target: Address.createFromEthereum({ value: wrappedNativeCurrencyAddress }),
                calldata: encodeFunctionData({
                  abi: wrappedNativeCurrencyAbi,
                  functionName: 'deposit',
                }),
                value: (
                  BigInt(order.sellAmount) - BigInt(wrappedNativeCurrencyBalance.toSolidityValue())
                ).toString(),
              },
              description: `Wrap ${formatEther(BigInt(order.sellAmount) - BigInt(wrappedNativeCurrencyBalance.toSolidityValue()))} of native currency to cover CowSwap order sell amount`,
            },
          }
        }
      }
    }

    // Create token amount from sell amount
    const sellTokenAddress = Address.createFromEthereum({ value: order.sellToken })
    const sellToken = this._tokensManager.getTokenByAddress({
      chainInfo,
      address: sellTokenAddress,
    })
    const sellAmount = TokenAmount.createFromBaseUnit({
      token: sellToken,
      amount: order.sellAmount,
    })

    // Check if approval is needed
    const approval = await this._allowanceManager.getApproval({
      chainInfo: sellToken.chainInfo,
      spender: this._getCowAddress(supportedChainId, 'relayer'),
      amount: sellAmount,
      owner: Address.createFromEthereum({ value: sender.value }),
    })

    if (approval) {
      return {
        status: CowSwapSendOrderStatus.AllowanceNeeded,
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
        status: CowSwapSendOrderStatus.OrderSent,
        orderId: orderId,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error('Error sending order to CowSwap:', e?.body?.errorType)
      throw new Error(`Failed to send order: ${e?.body?.errorType}`)
    }
  }

  /** @see IIntentSwapProvider.cancelOrder */
  cancelOrder: IIntentSwapProvider['cancelOrder'] = async (params) => {
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

  /** @see IIntentSwapProvider.checkOrder */
  checkOrder: IIntentSwapProvider['checkOrder'] = async (params) => {
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
