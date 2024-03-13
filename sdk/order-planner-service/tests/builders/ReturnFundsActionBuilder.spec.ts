import { Address, ChainInfo, Token } from '@summerfi/sdk-common/common'
import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { SetupBuilderReturnType, setupBuilderParams } from '../utils/SetupBuilderParams'
import { ChainFamilyMap } from '@summerfi/sdk-client'

import { ReturnFundsActionBuilder } from '../../src/builders/ReturnFundsActionBuilder'
import { ReturnFundsAction } from '../../src/actions'

describe('Return Funds Action Builder', () => {
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

  beforeEach(() => {
    builderParams = setupBuilderParams({ chainInfo: ChainFamilyMap.Ethereum.Mainnet })
  })

  it('should fail if no protocol plugin exists', async () => {
    const builderParams = setupBuilderParams({ chainInfo: ChainFamilyMap.Ethereum.Mainnet })

    const derivedStep: steps.ReturnFunds = {
      type: SimulationSteps.ReturnFunds,
      name: 'ReturnFundsStep',
      inputs: {
        token: WETH,
      },
      outputs: undefined,
    }

    builderParams.context.startSubContext()

    await ReturnFundsActionBuilder({
      ...builderParams,
      step: derivedStep,
    })

    const { callsBatch, customData } = builderParams.context.endSubContext()

    const returnFundsCalldata = new ReturnFundsAction().encodeCall({
      asset: WETH,
    })

    expect(customData).toBeUndefined()
    expect(callsBatch.length).toBe(1)
    expect(callsBatch[0]).toEqual(returnFundsCalldata)
  })
})
