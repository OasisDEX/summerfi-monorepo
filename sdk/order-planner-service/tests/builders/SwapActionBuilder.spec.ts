import {
  Address,
  AddressValue,
  ChainInfo,
  Percentage,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common/common'
import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { SwapProviderType } from '@summerfi/swap-common/enums'
import { ChainFamilyMap } from '@summerfi/sdk-client'

import { SetupBuilderReturnType, setupBuilderParams } from '../utils/SetupBuilderParams'
import { SwapActionBuilder } from '../../src/builders'
import { SwapAction } from '../../src/actions/SwapAction'

describe('Swap Action Builder', () => {
  let builderParams: SetupBuilderReturnType

  const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet

  // Tokens
  const WETH = Token.createFrom({
    chainInfo,
    address: Address.createFrom({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
  })

  const DAI = Token.createFrom({
    chainInfo,
    address: Address.createFrom({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
  })

  const fromAmount = TokenAmount.createFrom({
    token: WETH,
    amount: '1.5',
  })

  const toAmount = TokenAmount.createFrom({
    token: DAI,
    amount: '4050.8',
  })

  const slippage = Percentage.createFrom({ percentage: 0.3 })
  const fee = Percentage.createFrom({ percentage: 2.1 })

  beforeEach(() => {
    builderParams = setupBuilderParams({ chainInfo: ChainFamilyMap.Ethereum.Mainnet })
  })

  it('should encode the action calldata correctly', async () => {
    const derivedStep: steps.SwapStep = {
      type: SimulationSteps.Swap,
      name: 'SwapStep',
      inputs: {
        fromTokenAmount: fromAmount,
        toTokenAmount: toAmount,
        fee: fee,
        slippage,
      },
      outputs: {
        receivedAmount: toAmount,
      },
    }

    // Setup swap manager returned data
    builderParams.swapManager.setSwapData({
      provider: SwapProviderType.OneInch,
      fromTokenAmount: fromAmount,
      toTokenAmount: toAmount,
      calldata: '0x12345678900987654321' as const,
      targetContract: Address.createFrom({ value: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' }),
      value: '33',
      gasPrice: '8745',
    })

    builderParams.context.startSubContext()

    await SwapActionBuilder({
      ...builderParams,
      step: derivedStep,
    })

    const { callsBatch, customData } = builderParams.context.endSubContext()

    const swapCalldata = new SwapAction().encodeCall({
      fromAmount: fromAmount,
      toMinimumAmount: toAmount,
      fee: fee,
      withData: builderParams.swapManager.swapDataReturnValue.calldata,
      collectFeeInFromToken: true,
    })

    const swapContractAddress = builderParams.deployment.contracts['Swap'].address as AddressValue

    expect(builderParams.swapManager.lastGetSwapDataExactInputParams).toBeDefined()
    expect(builderParams.swapManager.lastGetSwapDataExactInputParams).toEqual({
      chainInfo: chainInfo,
      fromAmount: fromAmount,
      toToken: toAmount.token,
      recipient: Address.createFrom({ value: swapContractAddress }),
      slippage: slippage,
    })

    expect(customData).toBeUndefined()
    expect(callsBatch.length).toBe(1)
    expect(callsBatch[0]).toEqual(swapCalldata)
  })
})
