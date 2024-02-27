import { ChainFamilyMap } from '@summerfi/sdk-common/client'
import {
  Address,
  Percentage,
  Token,
  TokenAmount,
  type ChainInfo,
} from '@summerfi/sdk-common/common/implementation'
import { subtractPercentage } from '@summerfi/sdk-common/utils'
import { getSwapManager, SwapData, SwapProviderType } from '~swap-service'

describe('OneInch | SwapManager | Integration', () => {
  it.skip('should provide swap data', async () => {
    // SwapManager
    const swapManager = getSwapManager()

    // ChainInfo
    const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet

    // Tokens
    const WETH = await Token.createFrom({
      chainInfo,
      address: Address.createFrom({ hexValue: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
    })

    const DAI = await Token.createFrom({
      chainInfo,
      address: Address.createFrom({ hexValue: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
    })

    // TokenAmount
    const fromAmount: TokenAmount = TokenAmount.createFrom({
      token: WETH,
      amount: '34.5',
    })

    // Address
    const recipient: Address = Address.createFrom({
      hexValue: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    })

    // Percentage
    const slippage: Percentage = Percentage.createFrom({ percentage: 2.0 })

    const swapData: SwapData = await swapManager.getSwapData({
      chainInfo,
      fromAmount,
      toToken: DAI,
      recipient,
      slippage,
      forceUseProvider: SwapProviderType.OneInch,
    })

    const minimumOutputAmount = subtractPercentage(fromAmount, slippage)

    expect(swapData).toBeDefined()
    expect(swapData.provider).toEqual(SwapProviderType.OneInch)
    expect(swapData.fromTokenAmount).toEqual(fromAmount)
    expect(BigInt(swapData.toTokenAmount.toBaseUnit())).toBeGreaterThanOrEqual(
      BigInt(minimumOutputAmount.toBaseUnit()),
    )
    expect(swapData.calldata).toBeDefined()
    expect(swapData.targetContract).toBeDefined()
    expect(swapData.value).toBeDefined()
    expect(swapData.gasPrice).toBeDefined()
  })
})
