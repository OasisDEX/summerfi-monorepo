import { ConfigurationProvider } from '@summerfi/configuration-provider'
import {
  SDKError,
  SDKErrorType,
  isTokenAmount,
  QuoteData,
  SwapData,
  SwapError,
  SwapErrorType,
  SwapProviderType,
  isSwapError,
} from '@summerfi/sdk-common'
import {
  Address,
  ChainFamilyMap,
  IPercentage,
  ITokenAmount,
  Percentage,
  Token,
  TokenAmount,
  type ChainInfo,
} from '@summerfi/sdk-common'
import assert from 'assert'
import { SwapManagerFactory } from '../src/implementation/SwapManagerFactory'

describe('OneInch | SwapManager | Integration', () => {
  const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet

  // Tokens
  const WETH = Token.createFrom({
    chainInfo,
    address: Address.createFromEthereum({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
  })

  const DAI = Token.createFrom({
    chainInfo,
    address: Address.createFromEthereum({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
  })

  const sUSDe = Token.createFrom({
    chainInfo,
    address: Address.createFromEthereum({ value: '0x9d39a5de30e57443bff2a8307a4256c8797a3497' }),
    symbol: 'sUSDe',
    name: 'Staked USDe',
    decimals: 18,
  })

  const USDe = Token.createFrom({
    chainInfo,
    address: Address.createFromEthereum({ value: '0x4c9edd5852cd905f086c759e8383e09bff1e68b3' }),
    symbol: 'USDe',
    name: 'USDe',
    decimals: 18,
  })

  // TokenAmount
  const fromAmount: ITokenAmount = TokenAmount.createFrom({
    token: WETH,
    amount: '34.5',
  })

  // Address
  const recipient = Address.createFromEthereum({
    value: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  })

  // Percentage
  const slippage: IPercentage = Percentage.createFrom({ value: 2.0 })
  const Percentage100: IPercentage = Percentage.createFrom({ value: 100.0 })

  it('should provide swap data', async () => {
    // SwapManager
    const configProvider = new ConfigurationProvider()
    const swapManager = SwapManagerFactory.newSwapManager({ configProvider })

    const swapData: SwapData = await swapManager.getSwapDataExactInput({
      fromAmount,
      toToken: DAI,
      recipient: recipient,
      slippage,
    })

    const minimumOutputAmount = fromAmount.multiply(Percentage100.subtract(slippage))
    assert(isTokenAmount(minimumOutputAmount), 'minimumOutputAmount is not a TokenAmount')

    expect(swapData).toBeDefined()
    expect(swapData.provider).toEqual(SwapProviderType.OneInch)
    expect(swapData.fromTokenAmount).toEqual(fromAmount)
    expect(swapData.toTokenAmount.toSolidityValue()).toBeGreaterThanOrEqual(
      minimumOutputAmount.toSolidityValue(),
    )
    expect(swapData.calldata).toBeDefined()
    expect(swapData.targetContract).toBeDefined()
    expect(swapData.value).toBeDefined()
    expect(swapData.gasPrice).toBeDefined()
  })

  it('should provide quote data', async () => {
    // SwapManager
    const configProvider = new ConfigurationProvider()
    const swapManager = SwapManagerFactory.newSwapManager({ configProvider })

    const quoteData: QuoteData = await swapManager.getSwapQuoteExactInput({
      fromAmount,
      toToken: DAI,
    })

    const minimumOutputAmount = fromAmount.multiply(Percentage100.subtract(slippage))
    assert(isTokenAmount(minimumOutputAmount), 'minimumOutputAmount is not a TokenAmount')

    expect(quoteData).toBeDefined()
    expect(quoteData.provider).toEqual(SwapProviderType.OneInch)
    expect(quoteData.fromTokenAmount).toEqual(fromAmount)
    expect(quoteData.toTokenAmount.toSolidityValue()).toBeGreaterThanOrEqual(
      minimumOutputAmount.toSolidityValue(),
    )
  })

  it('should throw custom error', async () => {
    // SwapManager
    const configProvider = new ConfigurationProvider()
    const swapManager = SwapManagerFactory.newSwapManager({ configProvider })

    const sUSDeAmount = TokenAmount.createFrom({
      token: sUSDe,
      amount: '500000.0',
    })

    try {
      await swapManager.getSwapDataExactInput({
        fromAmount: sUSDeAmount,
        toToken: USDe,
        recipient: recipient,
        slippage,
      })

      assert.fail('Expected error to be thrown')
    } catch (error) {
      console.log(error)

      expect(error).toBeInstanceOf(SDKError)
      expect(error).toBeInstanceOf(SwapError)

      if (!isSwapError(error)) {
        assert.fail('Expected error to be a SwapError')
      }

      expect(error.type).toEqual(SDKErrorType.SwapError)
      expect(error.subtype).toEqual(SwapErrorType.NoLiquidity)
      expect(error.reason).toEqual('insufficient liquidity')
      expect(error.apiQuery).toBeDefined()
      expect(error.apiQuery.length).toBeGreaterThan(0)
      expect(error.statusCode).toEqual(400)
    }
  })
})
