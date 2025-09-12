/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeSDKWithSigner } from '@summerfi/sdk-client'
import { ChainIds, getChainInfoByChainId, TokenAmount, type ChainId } from '@summerfi/sdk-common'

import { SDKApiUrl, signerPrivateKey, testWalletAddress } from './utils/testConfig'
import { Wallet } from 'ethers'

jest.setTimeout(300000)

const chainId = ChainIds.Base
const rpcUrl = process.env.E2E_SDK_FORK_URL_BASE
if (!rpcUrl) {
  throw new Error('Missing fork url')
}
const wallet = new Wallet(signerPrivateKey)

describe('Intent swaps', () => {
  it('should test intent swap flow', async () => {
    // await runTests({
    //   chainId,
    //   fromSymbol: 'ETH',
    //   amountValue: '0.1',
    //   toSymbol: 'USDC',
    //   limitPrice: '5000',
    // })
    await runTests({
      chainId,
      fromSymbol: 'USDC',
      amountValue: '480',
      toSymbol: 'ETH',
      limitPrice: '0.00028',
    })
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
    const fromAmount = TokenAmount.createFrom({
      amount: amountValue,
      token: fromToken,
    })
    const toToken = await chain.tokens.getTokenBySymbol({ symbol: toSymbol })

    const sellQuote = await sdk.intentSwaps.getSellOrderQuote({
      from: testWalletAddress,
      fromAmount: fromAmount,
      toToken,
      limitPrice,
    })
    console.log('Sell Order:', sellQuote.order)

    // const orderId = await sdk.intentSwaps.sendOrder({
    //   chainId,
    //   order: sellQuote.order,
    // })
    // console.log('Order ID:', orderId)

    // const orderInfo = await sdk.intentSwaps.checkOrder({
    //   chainId,
    //   orderId: orderId.orderId,
    // })
    // assert(orderInfo, 'Order info should not be null')
    // console.log('Order Info:', orderInfo)

    // const cancelResult = await sdk.intentSwaps.cancelOrder({
    //   chainId,
    //   orderId: orderId.orderId,
    // })
    // console.log('Cancel Result:', cancelResult)
  }
})
