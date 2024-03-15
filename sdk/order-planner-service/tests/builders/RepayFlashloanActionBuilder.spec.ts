import { Address, ChainInfo, Token, TokenAmount } from '@summerfi/sdk-common/common'
import { FlashloanProvider, SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { SetupBuilderReturnType, setupBuilderParams } from '../utils/SetupBuilderParams'
import { ChainFamilyMap } from '@summerfi/sdk-client'
import { RepayFlashloanActionBuilder } from '../../src/builders/RepayFlashloanActionBuilder'
import { PullTokenAction } from '../../src/actions/PullTokenAction'
import { FlashloanAction } from '../../src/actions/FlashloanAction'
import { getErrorMessage } from '../utils/ErrorMessage'

describe('Payback Flashloan Action Builder', () => {
  let builderParams: SetupBuilderReturnType

  const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet

  // Tokens
  const DAI = Token.createFrom({
    chainInfo,
    address: Address.createFrom({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
    decimals: 18,
    name: 'Dai Stablecoin',
    symbol: 'DAI',
  })

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

  // Pull token step
  const pullAmount = TokenAmount.createFrom({ token: DAI, amount: '578' })
  const recipient = Address.createFrom({ value: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' })

  const pullTokenStep: steps.PullTokenStep = {
    name: 'PullTokenStep',
    type: SimulationSteps.PullToken,
    inputs: {
      amount: pullAmount,
    },
    outputs: undefined,
  }

  beforeEach(() => {
    builderParams = setupBuilderParams({ chainInfo: ChainFamilyMap.Ethereum.Mainnet })
  })

  it('should fail if there is no custom data from flashloan step', async () => {
    const repayFlashloanStep: steps.RepayFlashloan = {
      type: SimulationSteps.RepayFlashloan,
      name: 'RepayFlashloanStep',
      inputs: {
        amount: flashloanAmount,
      },
      outputs: undefined,
    }

    // Start a new global subcontext
    builderParams.context.startSubContext()

    // Now add the specific subcontext for the flashloan step
    builderParams.context.startSubContext()

    builderParams.context.addActionCall({
      step: pullTokenStep,
      action: new PullTokenAction(),
      arguments: {
        pullAmount: pullAmount,
        pullTo: recipient,
      },
      connectedInputs: {},
      connectedOutputs: {},
    })

    try {
      await RepayFlashloanActionBuilder({
        ...builderParams,
        step: repayFlashloanStep,
      })
    } catch (e: unknown) {
      expect(getErrorMessage(e)).toEqual('RepayFlashloanBuilder: customData is undefined')
    }
  })

  it('should perform flashloan call inversion', async () => {
    const flashloanStep: steps.FlashloanStep = {
      type: SimulationSteps.Flashloan,
      name: 'FlashloanStep',
      inputs: {
        amount: flashloanAmount,
        provider: FlashloanProvider.Balancer,
      },
      outputs: undefined,
    }

    const repayFlashloanStep: steps.RepayFlashloan = {
      type: SimulationSteps.RepayFlashloan,
      name: 'RepayFlashloanStep',
      inputs: {
        amount: flashloanAmount,
      },
      outputs: undefined,
    }

    // Start a new global subcontext
    builderParams.context.startSubContext()

    // Now add the specific subcontext for the flashloan step
    builderParams.context.startSubContext({ customData: flashloanStep.inputs })

    builderParams.context.addActionCall({
      step: pullTokenStep,
      action: new PullTokenAction(),
      arguments: {
        pullAmount: pullAmount,
        pullTo: recipient,
      },
      connectedInputs: {},
      connectedOutputs: {},
    })

    await RepayFlashloanActionBuilder({
      ...builderParams,
      step: repayFlashloanStep,
    })

    expect(builderParams.context.subContextLevels).toBe(1)

    const { callsBatch, customData } = builderParams.context.endSubContext()

    expect(customData).toEqual(undefined)
    expect(callsBatch.length).toEqual(1)

    const pullTokenCalldata = new PullTokenAction().encodeCall({
      pullAmount: pullAmount,
      pullTo: recipient,
    })

    const flashloanCalldata = new FlashloanAction().encodeCall({
      amount: flashloanStep.inputs.amount,
      provider: flashloanStep.inputs.provider,
      calls: [pullTokenCalldata],
    })

    expect(callsBatch[0]).toEqual(flashloanCalldata)
  })
})
