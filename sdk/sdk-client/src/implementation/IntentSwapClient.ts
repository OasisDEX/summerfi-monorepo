import { IRPCClient } from '../interfaces/IRPCClient'
import type { RPCMainClientType } from '../rpc/SDKMainClient'
import type { IIntentSwapClient } from '../interfaces/IIntentSwapClient'
import {
  OrderSigningUtils,
  type SupportedChainId,
  ALL_SUPPORTED_CHAIN_IDS,
  TradingSdk,
  type SwapAdvancedSettings,
  OrderKind,
  AdapterContext,
  type OrderPostingResult,
  OrderBookApi,
  type LimitTradeParameters,
  WRAPPED_NATIVE_CURRENCIES,
} from '@cowprotocol/cow-sdk'
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter'
import { encodeFunctionData, maxUint256, erc20Abi } from 'viem'
import { permit2Address } from '@uniswap/permit2-sdk'

import {
  LoggingService,
  NATIVE_CURRENCY_ADDRESS_LOWERCASE,
  Price,
  TransactionType,
} from '@summerfi/sdk-common'

const PERMIT2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3' as const
const PERMIT2_EXPIRATION_MINUTES = 10

/**
 * @name IntentSwapClient
 * @implements IIntentSwapClient
 */
export class IntentSwapClient extends IRPCClient implements IIntentSwapClient {
  private _validateChainId(chainId: number) {
    if (!ALL_SUPPORTED_CHAIN_IDS.includes(chainId as SupportedChainId)) {
      throw new Error(`Unsupported chainId: ${chainId}`)
    }
  }

  public constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
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
      slippagePercentage: params.slippagePercentage,
      validFor: PERMIT2_EXPIRATION_MINUTES * 60,
    })
  }

  /** @see IIntentSwapClient.sendOrder */
  sendOrder: IIntentSwapClient['sendOrder'] = async (params) => {
    // validate chainId
    this._validateChainId(params.chainId)

    const adapter = new ViemAdapter({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      provider: params.publicClient as any,
      ...(params.account
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { signer: params.account as any }
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { walletClient: params.walletClient as any }),
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
    const {
      chainId,
      account,
      walletClient,
      sender,
      publicClient,
      fromAmount,
      limitPrice,
      toToken,
      postHooks,
      preHooks,
      apiKey,
      order,
      slippagePercentage,
    } = params
    // validate chainId
    this._validateChainId(chainId)

    const adapter = new ViemAdapter({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      provider: publicClient as any,
      ...(account
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { signer: account as any } // eslint-disable-next-line @typescript-eslint/no-explicit-any
        : { walletClient: walletClient as any }),
    })
    AdapterContext.getInstance().setAdapter(adapter)

    const orderBookApi = apiKey
      ? new OrderBookApi({ chainId: chainId as SupportedChainId, apiKey })
      : undefined

    const tradingSdk = new TradingSdk(
      {
        chainId: chainId as SupportedChainId,
        appCode: 'summerfi-sdk',
      },
      { orderBookApi: orderBookApi },
      adapter,
    )

    const fromTokenAddress = fromAmount.token.address.toSolidityValue()

    // approval handling for erc20 tokens (not needed for native token)
    const isNativeToken = fromTokenAddress === NATIVE_CURRENCY_ADDRESS_LOWERCASE
    if (!isNativeToken) {
      const currentAllowance = await tradingSdk.getCowProtocolAllowance({
        tokenAddress: fromTokenAddress,
        owner: sender.toSolidityValue(),
      })
      const requiredAmount = fromAmount.toSolidityValue()
      // Only approve if needed
      if (currentAllowance < requiredAmount) {
        const txHash = await tradingSdk.approveCowProtocol({
          tokenAddress: fromTokenAddress,
          amount: requiredAmount,
        })
        LoggingService.debug('IntentSwapClient: approval transaction:', txHash)
      } else {
        LoggingService.debug(
          'IntentSwapClient: sufficient allowance already exists. Skipping approval.',
        )
      }
    }

    const buyAmount = limitPrice.multiply(fromAmount)

    const parameters: LimitTradeParameters = {
      kind: OrderKind.SELL,
      sellToken: isNativeToken
        ? WRAPPED_NATIVE_CURRENCIES[chainId as SupportedChainId].address
        : fromTokenAddress,
      sellTokenDecimals: fromAmount.token.decimals,
      buyToken: toToken.address.toSolidityValue(),
      buyTokenDecimals: toToken.decimals,
      sellAmount: fromAmount.toSolidityValue().toString(),
      buyAmount: buyAmount.toSolidityValue().toString(),
      slippageBps: slippagePercentage ? Math.round(slippagePercentage * 100) : undefined,
      validTo: order.validTo,
    }
    LoggingService.debug('IntentSwapClient: trade parameters', parameters)

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
      orderPostResult = await tradingSdk.postLimitOrder(parameters, advancedSettings)
    } catch (error) {
      LoggingService.error('IntentSwapClient: Error posting swap order:', error)
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
      ...(params.account
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { signer: params.account as any } // eslint-disable-next-line @typescript-eslint/no-explicit-any
        : { walletClient: params.walletClient as any }),
    })
    AdapterContext.getInstance().setAdapter(adapter)

    const orderCancellationsSigningResult = await OrderSigningUtils.signOrderCancellation(
      params.orderId,
      params.chainId as SupportedChainId,
      adapter.signer,
    )

    return this.rpcClient.intentSwaps.cancelOrder.query({
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

  /** @see IIntentSwapClient.isPermit2AuthorizationNeeded */
  isPermit2AuthorizationNeeded: IIntentSwapClient['isPermit2AuthorizationNeeded'] = async (
    params,
  ) => {
    if (params.amount === 0n) {
      LoggingService.debug('Allowance amount is zero')
      return false
    }

    if (params.tokenAddress.toSolidityValue() === NATIVE_CURRENCY_ADDRESS_LOWERCASE) {
      LoggingService.debug('Token is native currency, no approval needed')
      // Native token (e.g. ETH) does not require approval
      return false
    }

    const allowance = await params.publicClient.readContract({
      address: params.tokenAddress.toSolidityValue() as `0x${string}`,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [params.ownerAddress.toSolidityValue() as `0x${string}`, PERMIT2_ADDRESS],
    })

    return allowance < params.amount
  }

  /** @see IIntentSwapClient.getPermit2AuthorizationTx */
  getPermit2AuthorizationTx: IIntentSwapClient['getPermit2AuthorizationTx'] = (params) => {
    if (params.tokenAddress.toSolidityValue() === NATIVE_CURRENCY_ADDRESS_LOWERCASE) {
      throw new Error('Native token does not require Permit2 authorization')
    }

    const calldata = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [PERMIT2_ADDRESS, maxUint256],
    })
    return [
      {
        type: TransactionType.Permit2Authorization,
        transaction: {
          target: params.tokenAddress,
          calldata,
          value: '0',
        },
        description: `Authorize Permit2 to spend token ${params.tokenAddress.toSolidityValue()}`,
      },
    ]
  }

  /** @see IIntentSwapClient.getPermit2RevokeTx */
  getPermit2RevokeTx: IIntentSwapClient['getPermit2RevokeTx'] = (params) => {
    if (params.tokenAddress.toSolidityValue() === NATIVE_CURRENCY_ADDRESS_LOWERCASE) {
      throw new Error('Native token does not require Permit2 authorization, so no need to revoke')
    }

    const calldata = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [PERMIT2_ADDRESS, 0n],
    })
    return [
      {
        type: TransactionType.Permit2Revoke,
        transaction: {
          target: params.tokenAddress,
          calldata,
          value: '0',
        },
        description: `Revoke Permit2 authorization for token ${params.tokenAddress.toSolidityValue()}`,
      },
    ]
  }

  /** @see IIntentSwapClient.createPermit2Data */
  createPermit2Data: IIntentSwapClient['createPermit2Data'] = async (params) => {
    const { chainId, tokenAddress, amount, spenderAddress, signTypedData, viemAccount } = params

    const nonce = BigInt(Date.now())
    const deadline = BigInt(Math.floor(Date.now() / 1000) + PERMIT2_EXPIRATION_MINUTES * 60) // X minutes from now

    const permitData = {
      permitted: {
        token: tokenAddress,
        amount,
      },
      nonce,
      deadline,
    }

    const domain = {
      name: 'Permit2',
      chainId,
      verifyingContract: permit2Address(chainId) as `0x${string}`,
    }

    const types = {
      PermitTransferFrom: [
        { name: 'permitted', type: 'TokenPermissions' },
        { name: 'spender', type: 'address' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
      TokenPermissions: [
        { name: 'token', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
    }

    if (!signTypedData) {
      throw new Error('signTypedData is required to create Permit2 data.')
    }
    if (!viemAccount) {
      throw new Error('viemAccount is required to create Permit2 data.')
    }

    const signature = await signTypedData({
      account: viemAccount,
      domain,
      types,
      primaryType: 'PermitTransferFrom',
      message: {
        permitted: {
          token: tokenAddress,
          amount,
        },
        spender: spenderAddress,
        nonce,
        deadline,
      },
    })

    return { permitData, signature }
  }
}
