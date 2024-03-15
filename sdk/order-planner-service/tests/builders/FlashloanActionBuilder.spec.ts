import { Address, ChainInfo, Token, TokenAmount } from '@summerfi/sdk-common/common'
import { FlashloanProvider, SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { SetupBuilderReturnType, setupBuilderParams } from '../utils/SetupBuilderParams'
import { ChainFamilyMap } from '@summerfi/sdk-client'
import { FlashloanActionBuilder } from '../../src/builders/FlashloanActionBuilder'

describe('Flashloan Action Builder', () => {
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

  const flashloanAmount = TokenAmount.createFrom({
    token: WETH,
    amount: '134.5',
  })

  beforeEach(() => {
    builderParams = setupBuilderParams({ chainInfo: ChainFamilyMap.Ethereum.Mainnet })
  })

  it('should start a new subcontext', async () => {
    const derivedStep: steps.FlashloanStep = {
      type: SimulationSteps.Flashloan,
      name: 'FlashloanStep',
      inputs: {
        amount: flashloanAmount,
        provider: FlashloanProvider.Balancer,
      },
      outputs: undefined,
    }

    await FlashloanActionBuilder({
      ...builderParams,
      step: derivedStep,
    })

    expect(builderParams.context.subContextLevels).toBe(1)

    const { callsBatch, customData } = builderParams.context.endSubContext()

    expect(callsBatch).toEqual([])
    expect(customData).toEqual(derivedStep.inputs)
  })
})
