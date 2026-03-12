import {
  Address,
  ChainIds,
  TokenAmount,
  type ChainId,
  type TransactionInfo,
} from '@summerfi/sdk-common'
import { RpcUrls, SDKApiUrl, SharedConfig } from './utils/testConfig'
import assert from 'assert'
import { makeSDK } from '@summerfi/sdk-client'
import { createSendTransactionTool, getPublicClientForChain } from '@summerfi/testing-utils'
import { privateKeyToAccount } from 'viem/accounts'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Intent swaps: Swap', () => {
  const signerPrivateKey = SharedConfig.testUserPrivateKey
  const senderAddressValue = SharedConfig.testUserAddressValue
  const account = privateKeyToAccount(signerPrivateKey)

  // Configure test scenarios here
  const intentSwapScenarios: {
    chainId: ChainId
    fromSymbol: string
    amountValue: string
    toSymbol: string
    sendOrder: boolean
    cancelOrder: boolean
    limitPrice?: string
  }[] = [
    // {
    //   chainId: ChainIds.Base,
    //   fromSymbol: 'ETH',
    //   amountValue: '0.0005',
    //   toSymbol: 'USDC',
    //   limitPrice: '4720',
    //   sendOrder: true,
    //   cancelOrder: true,
    // },
    {
      chainId: ChainIds.Base,
      fromSymbol: 'USDC',
      amountValue: '5',
      toSymbol: 'ETH',
      // limitPrice: '0.0003',
      sendOrder: true,
      cancelOrder: true,
    },
  ]

  describe.each(intentSwapScenarios)('with scenario %#', (scenario) => {
    const { chainId, fromSymbol, amountValue, toSymbol, limitPrice, sendOrder, cancelOrder } =
      scenario

    const publicClient = getPublicClientForChain(chainId, RpcUrls[chainId])

    it('should complete intent swap flow', async () => {
      const sdk = makeSDK({
        apiDomainUrl: SDKApiUrl,
      })
      const userSendTxTool = createSendTransactionTool({
        chainId,
        rpcUrl: RpcUrls[chainId],
        signerPrivateKey,
        senderAddressValue,
      })

      const userAddress = Address.createFromEthereum({ value: senderAddressValue })

      // for ETH, we cannot use ETH directly we need to use WETH
      // there is eth-flow but only smart wallets and no limit orders
      const fromToken = await sdk.tokens.getTokenBySymbol({ chainId, symbol: fromSymbol })

      const fromAmount = TokenAmount.createFrom({
        amount: amountValue,
        token: fromToken,
      })
      const toToken = await sdk.tokens.getTokenBySymbol({ chainId, symbol: toSymbol })

      // get sell order quote
      const sellQuote = await sdk.intentSwaps.getSellOrderQuote({
        sender: userAddress,
        fromAmount: fromAmount,
        toToken,
        limitPrice,
      })
      console.log('Sell Order Quote:', fromAmount.toString(), '=>', sellQuote.toAmount.toString())

      if (sendOrder === false) {
        console.log('Skipping sending order')
        return
      }

      // loop to check allowance, wrap if needed, and finally send order
      let orderId: string | undefined
      do {
        const orderReturn = await sdk.intentSwaps.sendOrder({
          sender: userAddress,
          fromAmount: sellQuote.fromAmount,
          chainId,
          order: sellQuote.order,
          account,
          publicClient,
        })
        orderId = await handleOrderReturn({
          orderReturn,
          userSendTxTool,
        })
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
        account,
        publicClient,
      })
      console.log('Cancel Order:', cancelResult)
    })
  })
})

async function handleOrderReturn({
  orderReturn,
  userSendTxTool,
}: {
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
      }
  userSendTxTool: ReturnType<typeof createSendTransactionTool>
}): Promise<string | undefined> {
  switch (orderReturn.status) {
    case 'wrap_to_native':
    case 'allowance_needed': {
      console.log(`Handling ${orderReturn.status} tx...`)
      // send tx
      const status = await userSendTxTool(orderReturn.transactionInfo)
      // Verify transaction success
      expect(status).toBe('success')
      return undefined
    }
    case 'order_sent':
      console.log('Order sent:', orderReturn.orderId)
      return orderReturn.orderId
    default:
      throw new Error(`Unknown order status`)
  }
}
