import { Address, ChainFamilyMap, ChainInfo, Token, TokenAmount } from '@summerfi/sdk-common'
import { SimulationSteps, steps } from '@summerfi/sdk-common'
import { SetupBuilderReturnType, setupBuilderParams } from '../../utils/SetupBuilderParams'

import { PullTokenActionBuilder } from '../../../src/plugins/common/builders'
import { PullTokenAction } from '../../../src/plugins/common/actions'

describe('Pull TokenAction Builder', () => {
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

  const pullAmount = TokenAmount.createFrom({
    token: WETH,
    amount: '134.5',
  })

  const derivedStep: steps.PullTokenStep = {
    type: SimulationSteps.PullToken,
    name: 'PullTokenStep',
    inputs: {
      amount: pullAmount,
    },
    outputs: undefined,
  }

  beforeEach(() => {
    builderParams = setupBuilderParams({ chainInfo: ChainFamilyMap.Ethereum.Mainnet })
  })

  it('should encode the action calldata correctly', async () => {
    builderParams.context.startSubContext()

    await new PullTokenActionBuilder().build({
      ...builderParams,
      step: derivedStep,
    })

    const { callsBatch, customData } = builderParams.context.endSubContext()

    const pullTokenCalldata = new PullTokenAction().encodeCall({
      pullAmount: pullAmount,
      pullFrom: builderParams.positionsManager.address,
    })

    expect(customData).toBeUndefined()
    expect(callsBatch.length).toBe(1)
    expect(callsBatch[0]).toEqual(pullTokenCalldata)
  })
})
