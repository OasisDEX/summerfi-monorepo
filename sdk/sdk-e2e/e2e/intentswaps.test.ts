import {
  Address,
  ChainIds,
  TokenAmount,
  type ChainId,
  type TransactionInfo,
} from '@summerfi/sdk-common'
import { RpcUrls, SDKApiUrl, SharedConfig } from './utils/testConfig'
import assert from 'assert'
import { makeSDKWithSigner } from '@summerfi/sdk-client'
import { Wallet } from 'ethers'
import { createSendTransactionTool } from '@summerfi/testing-utils'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Intent swaps', () => {
  const signerPrivateKey = SharedConfig.testUserPrivateKey
  const signerAddressValue = SharedConfig.testUserAddressValue

  // Configure test scenarios here
  const intentSwapScenarios: {
    chainId: ChainId
    rpcUrl: string
    fromSymbol: string
    amountValue: string
    toSymbol: string
    sendOrder: boolean
    cancelOrder: boolean
    limitPrice?: string
  }[] = [
    {
      chainId: ChainIds.Base,
      rpcUrl: RpcUrls.Base,
      fromSymbol: 'ETH',
      amountValue: '0.0005',
      toSymbol: 'USDC',
      limitPrice: '4720',
      sendOrder: true,
      cancelOrder: true,
    },
    // {
    //   fromSymbol: 'USDC',
    //   amountValue: '4',
    //   toSymbol: 'ETH',
    //   limitPrice: '0.0003',
    //   sendOrder: true,
    //   cancelOrder: true,
    // },
  ]

  describe.each(intentSwapScenarios)('with scenario %#', (scenario) => {
    const {
      chainId,
      rpcUrl,
      fromSymbol,
      amountValue,
      toSymbol,
      limitPrice,
      sendOrder,
      cancelOrder,
    } = scenario

    it('should complete intent swap flow', async () => {
      const sdk = makeSDKWithSigner({
        apiDomainUrl: SDKApiUrl,
        signer: new Wallet(signerPrivateKey),
      })
      const userSendTxTool = createSendTransactionTool({
        chainId,
        rpcUrl,
        signerPrivateKey,
      })

      const userAddress = Address.createFromEthereum({ value: signerAddressValue })

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
      console.log('Sell Order Quote:', sellQuote.order)

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
