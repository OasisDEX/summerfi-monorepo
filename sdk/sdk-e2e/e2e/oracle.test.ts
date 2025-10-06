/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChainIds, getChainInfoByChainId, TokenAmount, type ChainId } from '@summerfi/sdk-common'

import { createTestSDK } from './utils/sdkInstance'

jest.setTimeout(300000)

const chainId = ChainIds.Base
const rpcUrl = process.env.E2E_SDK_FORK_URL_BASE
if (!rpcUrl) {
  throw new Error('Missing fork url')
}

describe('Oracle Tests', () => {
  it('should test getSpotPrice', async () => {
    await runTests({
      chainId,
    })
  })

  async function runTests({ chainId }: { chainId: ChainId }) {
    const sdk = createTestSDK()

    const chainInfo = getChainInfoByChainId(chainId)
    const chain = await sdk.chains.getChain({ chainInfo })

    const fromToken = await chain.tokens.getTokenBySymbol({ symbol: 'wsteth' })
    const toToken = await chain.tokens.getTokenBySymbol({ symbol: 'eth' })

    const spot = await sdk.oracle.getSpotPrice({
      baseToken: fromToken,
      denomination: toToken,
    })
    console.log('Spot price:', spot.price.toString())
    console.log('Token:', spot.token.toString())
    console.log('Provider:', spot.provider.toString())
  }
})
