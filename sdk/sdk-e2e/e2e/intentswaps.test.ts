/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeSDKWithProvider } from '@summerfi/sdk-client'
import { ChainIds, getChainInfoByChainId, TokenAmount, type ChainId } from '@summerfi/sdk-common'

import { SDKApiUrl, userAddress } from './utils/testConfig'
import assert from 'assert'
import { JsonRpcProvider } from '@ethersproject/providers'

jest.setTimeout(300000)

const chainId = ChainIds.Base
const rpcUrl = process.env.E2E_SDK_FORK_URL_BASE

describe('Armada Protocol Switch', () => {
  it('should switch position', async () => {
    await runTests({
      chainId,
      rpcUrl,
      amountValue: '1',
    })
  })

  async function runTests({
    chainId,
    rpcUrl,
    amountValue,
  }: {
    chainId: ChainId
    rpcUrl: string | undefined
    amountValue: string
  }) {
    if (!rpcUrl) {
      throw new Error('Missing fork url')
    }
    const sdk = makeSDKWithProvider({
      apiURL: SDKApiUrl,
      provider: new JsonRpcProvider(rpcUrl, chainId),
    })

    const chainInfo = getChainInfoByChainId(chainId)
    const chain = await sdk.chains.getChain({ chainInfo })
    const toToken = await chain.tokens.getTokenBySymbol({ symbol: 'DAI' })
    const fromToken = await chain.tokens.getTokenBySymbol({ symbol: 'USDC' })
    const fromAmount = TokenAmount.createFrom({
      amount: amountValue,
      token: fromToken,
    })

    const sellQuote = await sdk.intentSwaps.getSellOrderQuote({
      from: userAddress,
      fromAmount: fromAmount,
      toToken,
    })

    const orderId = await sdk.intentSwaps.sendOrder({
      chainId,
      order: sellQuote.order,
    })

    console.log('Order ID:', orderId)

    const orderInfo = await sdk.intentSwaps.checkOrder({
      chainId,
      orderId: orderId.orderId,
    })

    console.log('Order Info:', orderInfo)

    assert(orderInfo, 'Order info should not be null')

    const cancelResult = await sdk.intentSwaps.cancelOrder({
      chainId,
      orderId: orderId.orderId,
    })
    console.log('Cancel Result:', cancelResult)
  }
})
