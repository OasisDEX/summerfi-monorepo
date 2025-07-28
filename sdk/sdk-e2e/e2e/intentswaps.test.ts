/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeSDKWithProvider } from '@summerfi/sdk-client'
import { ChainIds, getChainInfoByChainId, TokenAmount, type ChainId } from '@summerfi/sdk-common'

import { SDKApiUrl, signerPrivateKey, userAddress } from './utils/testConfig'
import assert from 'assert'
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
    await runTests({
      chainId,
      amountValue: '1',
      limitPrice: '1.5',
    })
  })

  async function runTests({
    chainId,
    amountValue,
    limitPrice,
  }: {
    chainId: ChainId
    amountValue: string
    limitPrice?: string
  }) {
    const sdk = makeSDKWithProvider({
      apiDomainUrl: SDKApiUrl,
      signer: wallet,
    })

    const chainInfo = getChainInfoByChainId(chainId)
    const chain = await sdk.chains.getChain({ chainInfo })
    const fromToken = await chain.tokens.getTokenBySymbol({ symbol: 'USDC' })
    const fromAmount = TokenAmount.createFrom({
      amount: amountValue,
      token: fromToken,
    })
    const toToken = await chain.tokens.getTokenBySymbol({ symbol: 'DAI' })

    const sellQuote = await sdk.intentSwaps.getSellOrderQuote({
      from: userAddress,
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
