import { Address, ChainFamilyMap, ChainInfo, Token, TokenAmount } from '@summerfi/sdk-common'
import { FlashloanProvider, SimulationSteps, steps } from '@summerfi/sdk-common'
import { SetupBuilderReturnType, setupBuilderParams } from '../../utils/SetupBuilderParams'
import { FlashloanActionBuilder } from '../../../src/plugins/common/builders/FlashloanActionBuilder'

describe('Flashloan Action Builder', () => {
  let builderParams: SetupBuilderReturnType

  const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet

  // Tokens
  const WETH = Token.createFrom({
    chainInfo,
    address: Address.createFromEthereum({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
  })

  const flashloanAmount = TokenAmount.createFrom({
    token: WETH,
    amount: '134.5',
  })

  const derivedStep: steps.FlashloanStep = {
    type: SimulationSteps.Flashloan,
    name: 'FlashloanStep',
    inputs: {
      amount: flashloanAmount,
      provider: FlashloanProvider.Balancer,
    },
    outputs: undefined,
  }

  beforeEach(() => {
    builderParams = setupBuilderParams({ chainInfo: ChainFamilyMap.Ethereum.Mainnet })
  })

  it('should start a new subcontext', async () => {
    await new FlashloanActionBuilder().build({
      ...builderParams,
      step: derivedStep,
    })

    expect(builderParams.context.subContextLevels).toBe(1)

    const { callsBatch, customData } = builderParams.context.endSubContext()

    expect(callsBatch).toEqual([])
    expect(customData).toEqual(derivedStep.inputs)
  })
})
