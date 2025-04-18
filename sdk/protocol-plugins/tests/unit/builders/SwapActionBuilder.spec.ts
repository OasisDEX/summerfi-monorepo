import {
  Address,
  ChainFamilyMap,
  ChainInfo,
  Percentage,
  Price,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common'
import { SimulationSteps, steps } from '@summerfi/sdk-common'
import { SwapProviderType } from '@summerfi/sdk-common'

import { FiatCurrency } from '@summerfi/sdk-common'
import { AddressBookManagerMock } from '@summerfi/testing-utils'
import { SwapAction } from '../../../src/plugins/common/actions/SwapAction'
import { SwapActionBuilder } from '../../../src/plugins/common/builders/SwapActionBuilder'
import { SetupBuilderReturnType, setupBuilderParams } from '../../utils/SetupBuilderParams'

describe('Swap Action Builder', () => {
  let builderParams: SetupBuilderReturnType

  const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet

  const SwapContractAddress = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'

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

  const inputAmount = TokenAmount.createFrom({
    token: WETH,
    amount: '1.5',
  })

  const toAmount = TokenAmount.createFrom({
    token: DAI,
    amount: '4050.8',
  })

  const spotPrice = Price.createFrom({
    value: '123',
    base: WETH,
    quote: FiatCurrency.USD,
  })

  const offerPrice = Price.createFrom({
    value: '456',
    base: WETH,
    quote: FiatCurrency.USD,
  })

  const percent100 = Percentage.createFrom({ value: 100 })
  const slippage = Percentage.createFrom({ value: 0.3 })
  const fee = Percentage.createFrom({ value: 2.1 })

  const inputAmountAfterFee = inputAmount.multiply(percent100.subtract(fee))

  const derivedStep: steps.SwapStep = {
    type: SimulationSteps.Swap,
    name: 'SwapStep',
    inputs: {
      provider: SwapProviderType.OneInch,
      routes: [],
      spotPrice: spotPrice,
      offerPrice: offerPrice,
      inputAmount: inputAmount,
      inputAmountAfterFee: inputAmountAfterFee,
      estimatedReceivedAmount: toAmount,
      minimumReceivedAmount: toAmount,
      summerFee: fee,
      slippage,
    },
    outputs: {
      received: toAmount,
    },
  }

  beforeEach(() => {
    builderParams = setupBuilderParams({ chainInfo: ChainFamilyMap.Ethereum.Mainnet })
    ;(builderParams.addressBookManager as AddressBookManagerMock).setAddressByName({
      chainInfo,
      name: 'Swap',
      address: SwapContractAddress,
    })
  })

  it('should encode the action calldata correctly', async () => {
    // Setup swap manager returned data
    builderParams.swapManager.setSwapData({
      provider: SwapProviderType.OneInch,
      fromTokenAmount: inputAmount,
      toTokenAmount: toAmount,
      calldata: '0x12345678900987654321' as const,
      targetContract: Address.createFromEthereum({
        value: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      }),
      value: '33',
      gasPrice: '8745',
    })

    builderParams.context.startSubContext()

    await new SwapActionBuilder().build({
      ...builderParams,
      step: derivedStep,
    })

    const { callsBatch, customData } = builderParams.context.endSubContext()

    const swapCalldata = new SwapAction().encodeCall({
      fromAmount: inputAmount,
      toMinimumAmount: toAmount,
      fee: fee,
      withData: builderParams.swapManager.swapDataReturnValue.calldata,
      collectFeeInFromToken: true,
    })

    expect(builderParams.swapManager.lastGetSwapDataExactInputParams).toBeDefined()
    expect(builderParams.swapManager.lastGetSwapDataExactInputParams).toEqual({
      fromAmount: inputAmountAfterFee,
      toToken: toAmount.token,
      recipient: Address.createFromEthereum({ value: SwapContractAddress }),
      slippage: slippage,
    })

    expect(customData).toBeUndefined()
    expect(callsBatch.length).toBe(1)
    expect(callsBatch[0]).toEqual(swapCalldata)
  })
})
