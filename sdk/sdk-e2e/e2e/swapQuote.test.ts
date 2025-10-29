import { ChainIds, TokenAmount, Percentage, Token } from '@summerfi/sdk-common'

import { createTestSDK } from './utils/sdkInstance'
import type { SwapScenario } from './utils/types'

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Swap Tests', () => {
  const sdk = createTestSDK()
  const slippage = Percentage.createFrom({ value: 0.5 })

  // Configure test scenarios here
  const swapQuoteScenarios: SwapScenario[] = [
    {
      description: 'get swap quote on Base (ETH -> WETH)',
      chainId: ChainIds.Base,
      fromTokenSymbol: 'eth',
      toTokenSymbol: 'weth',
      fromAmount: '10',
      slippage,
    },
    {
      description: 'get swap quote on Mainnet (WBTC -> USDC)',
      chainId: ChainIds.Mainnet,
      fromTokenSymbol: 'wbtc',
      toTokenSymbol: 'usdc',
      fromAmount: '0.01',
      slippage,
    },
    {
      description: 'get swap quote on Arbitrum One (WETH -> ETH)',
      chainId: ChainIds.ArbitrumOne,
      fromTokenSymbol: 'weth',
      toTokenSymbol: 'eth',
      fromAmount: '50',
      slippage,
    },
    {
      description: 'get swap quote on Sonic (S -> USDC)',
      chainId: ChainIds.Sonic,
      fromTokenSymbol: 's',
      toTokenSymbol: 'USDC.E',
      fromAmount: '100',
      slippage,
    },
  ]
  describe('getSwapQuoteExactInput', () => {
    test.each(swapQuoteScenarios)(
      'should $description',
      async ({ chainId, fromTokenSymbol, toTokenSymbol, fromAmount, slippage }) => {
        const fromToken = await sdk.tokens.getTokenBySymbol({ chainId, symbol: fromTokenSymbol })
        const toToken = await sdk.tokens.getTokenBySymbol({ chainId, symbol: toTokenSymbol })

        const fromTokenAmount = TokenAmount.createFrom({
          token: fromToken,
          amount: fromAmount,
        }) as TokenAmount

        const quote = await sdk.swaps.getSwapQuoteExactInput({
          fromAmount: fromTokenAmount,
          toToken: toToken as Token,
          slippage,
        })

        expect(quote).toBeDefined()
        expect(quote.fromTokenAmount).toBeDefined()
        expect(quote.toTokenAmount).toBeDefined()
        expect(quote.provider).toBeDefined()
        expect(quote.estimatedGas).toBeDefined()
        expect(quote.routes).toBeDefined()

        console.log(
          `Swap quote: ${quote.fromTokenAmount.toString()} -> ${quote.toTokenAmount.toString()} (provider: ${quote.provider.toString()}, gas: ${quote.estimatedGas}, slippage: ${slippage?.toString()}), routes: ${JSON.stringify(quote.routes, null, 2)}`,
        )
      },
    )
  })
})
