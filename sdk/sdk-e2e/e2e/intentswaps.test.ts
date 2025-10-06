/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeSDKWithSigner } from '@summerfi/sdk-client'
import {
  ChainIds,
  getChainInfoByChainId,
  TokenAmount,
  type ChainId,
  type TransactionInfo,
} from '@summerfi/sdk-common'

import { SDKApiUrl, signerPrivateKey, e2eWalletAddress } from './utils/testConfig'
import { Wallet } from 'ethers'
import assert from 'assert'
import { sendAndLogTransactions } from '@summerfi/testing-utils'

jest.setTimeout(300000)

const sendOrder: boolean = true // set to false to only get quote
const cancelOrder: boolean = true // set to false to skip order cancellation
const simulateOnly = false // set to true to only simulate transactions

const chainId = ChainIds.Base
const rpcUrl = process.env.E2E_SDK_FORK_URL_BASE
if (!rpcUrl) {
  throw new Error('Missing fork url')
}
const wallet = new Wallet(signerPrivateKey)

describe('Intent swaps', () => {
  it('should test intent swap flow', async () => {
    await runTests({
      chainId,
      fromSymbol: 'ETH',
      amountValue: '0.0005',
      toSymbol: 'USDC',
      limitPrice: '4720',
    })
    // await runTests({
    //   chainId,
    //   fromSymbol: 'USDC',
    //   amountValue: '4',
    //   toSymbol: 'ETH',
    //   limitPrice: '0.0003',
    // })
  })

  async function runTests({
    chainId,
    fromSymbol,
    amountValue,
    toSymbol,
    limitPrice,
  }: {
    chainId: ChainId
    fromSymbol: string
    amountValue: string
    toSymbol: string
    limitPrice?: string
  }) {
    const sdk = makeSDKWithSigner({
      apiDomainUrl: SDKApiUrl,
      signer: wallet,
    })

    const chainInfo = getChainInfoByChainId(chainId)
    const chain = await sdk.chains.getChain({ chainInfo })
    const fromToken = await chain.tokens.getTokenBySymbol({ symbol: fromSymbol })
    // for ETH, we cannot use ETH directly we need to use WETH
    // there is eth-flow but only smart wallets and no limit orders

    const fromAmount = TokenAmount.createFrom({
      amount: amountValue,
      token: fromToken,
    })
    const toToken = await chain.tokens.getTokenBySymbol({ symbol: toSymbol })

    // get sell order quote
    const sellQuote = await sdk.intentSwaps.getSellOrderQuote({
      sender: e2eWalletAddress,
      fromAmount: fromAmount,
      toToken,
      limitPrice,
    })
    console.log('Sell Order Quote:', sellQuote.order)

    if (sendOrder === false) {
      console.log('Skipping sending order')
      return
    }

    // loop to check allowance, wrap if needed, and finally send order
    let orderId
    do {
      const orderReturn = await sdk.intentSwaps.sendOrder({
        sender: e2eWalletAddress,
        fromAmount: sellQuote.fromAmount,
        chainId,
        order: sellQuote.order,
      })
      orderId = await handleOrderReturn(orderReturn)
    } while (orderId == null)

    // check order status
    const orderInfo = await sdk.intentSwaps.checkOrder({
      chainId,
      orderId: orderId,
    })
    assert(orderInfo, 'Order info should not be null')
    console.log('Check Order:', orderInfo)

    if (cancelOrder === false) {
      console.log('Skipping cancelling order')
      return
    }

    // cancel order
    const cancelResult = await sdk.intentSwaps.cancelOrder({
      chainId,
      orderId: orderId,
    })
    console.log('Cancel Order:', cancelResult)
  }
})

const handleOrderReturn = async (
  orderReturn:
    | {
        status: 'wrap_to_native'
        transactionInfo: TransactionInfo
      }
    | {
        status: 'allowance_needed'
        transactionInfo: TransactionInfo
      }
    | {
        status: 'order_sent'
        orderId: string
      },
) => {
  switch (orderReturn.status) {
    case 'wrap_to_native':
    case 'allowance_needed': {
      console.log(`Handling ${orderReturn.status} case...`)
      // send tx
      const { statuses } = await sendAndLogTransactions({
        chainInfo: getChainInfoByChainId(chainId),
        transactions: [orderReturn.transactionInfo],
        rpcUrl: rpcUrl,
        privateKey: signerPrivateKey,
        simulateOnly,
      })
      // Verify transaction success
      statuses.forEach((status) => {
        expect(status).toBe('success')
      })
      return
    }
    case 'order_sent':
      console.log('Order sent:', orderReturn.orderId)
      return orderReturn.orderId
    default:
      throw new Error(`Unknown order status`)
  }
}
