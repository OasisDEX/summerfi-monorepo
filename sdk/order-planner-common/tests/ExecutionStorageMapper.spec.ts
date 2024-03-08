import { Address, ChainInfo, Percentage, Token, TokenAmount } from '@summerfi/sdk-common/common'
import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { BaseAction } from '../src/actions/BaseAction'
import { ActionCall } from '../src/actions/Types'
import { ExecutionStorageMapper } from '../src/context/ExecutionStorageMapper'
import { ChainFamilyMap } from '@summerfi/sdk-client'

class DerivedAction extends BaseAction {
  public readonly config = {
    name: 'PullToken',
    version: 8,
    parametersAbi: 'address, address, uint256',
    storageInputs: ['someInput1', 'someInput2', 'otherInput'],
    storageOutputs: ['someOutput1', 'someOutput2', 'otherOutput'],
  }

  public encodeCall(params: { arguments: unknown[]; mapping?: number[] }): ActionCall {
    return this._encodeCall(params)
  }
}

describe.only('Execution Storage Mapper', () => {
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

  const derivedAction = new DerivedAction()

  const derivedStep: steps.SwapStep = {
    type: SimulationSteps.Swap,
    name: 'SwapStep',
    inputs: {
      fromTokenAmount: TokenAmount.createFrom({
        token: WETH,
        amount: '134.5',
      }),
      toTokenAmount: TokenAmount.createFrom({
        token: DAI,
        amount: '1000',
      }),
      slippage: Percentage.createFrom({ percentage: 0.01 }),
      fee: 0.003,
    },
    outputs: {
      receivedAmount: TokenAmount.createFrom({
        token: DAI,
        amount: '900',
      }),
    },
  }

  it('should return undefined if mapping does not exist', () => {
    const executionStorageMapper = new ExecutionStorageMapper()

    const slot = executionStorageMapper.getSlot({
      stepName: 'SwapStep',
      referenceName: 'fromTokenAmount',
    })

    expect(slot).toBeUndefined()
  })

  it('should add and retrieve storage slots', () => {
    const executionStorageMapper = new ExecutionStorageMapper()

    executionStorageMapper.addStorageMap({
      step: derivedStep,
      action: derivedAction,
      connectedInputs: {
        fromTokenAmount: 'someInput1',
        toTokenAmount: 'someInput2',
        fee: 'otherInput',
      },
      connectedOutputs: {
        receivedAmount: 'otherOutput',
      },
    })

    {
      const slot = executionStorageMapper.getSlot({
        stepName: 'SwapStep',
        referenceName: 'receivedAmount',
      })

      expect(slot).toBe(3)
    }
    {
      const slot = executionStorageMapper.getSlot({
        stepName: 'SwapStep',
        referenceName: 'fromTokenAmount',
      })

      expect(slot).toBeUndefined()
    }
    {
      const slot = executionStorageMapper.getSlot({
        stepName: 'SwapStep',
        referenceName: 'fee',
      })

      expect(slot).toBeUndefined()
    }
    {
      const slot = executionStorageMapper.getSlot({
        stepName: 'SwapStep',
        referenceName: 'toTokenAmount',
      })

      expect(slot).toBeUndefined()
    }
  })
})
