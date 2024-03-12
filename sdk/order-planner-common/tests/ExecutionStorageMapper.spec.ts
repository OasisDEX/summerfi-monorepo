import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { BaseAction } from '../src/actions/BaseAction'
import { ActionCall } from '../src/actions/Types'
import { ExecutionStorageMapper } from '../src/context/ExecutionStorageMapper'
import { ChainFamilyMap } from '@summerfi/sdk-client'
import {
  Address,
  ChainInfo,
  Position,
  PositionId,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common/common'
import { MakerPoolId, PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'

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

describe('Execution Storage Mapper', () => {
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

  const depositAmount = TokenAmount.createFrom({
    token: WETH,
    amount: '134.5',
  })

  const borrowAmount = TokenAmount.createFrom({
    token: DAI,
    amount: '1000',
  })

  const protocol = {
    name: ProtocolName.Maker,
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  }

  const poolId = {
    protocol: ProtocolName.Maker,
    ilkType: 'ETH-A',
    vaultId: 'somevault',
  } as MakerPoolId

  const pool = {
    type: PoolType.Lending,
    protocol,
    poolId,
  }

  const position = new Position({
    positionId: PositionId.createFrom({ id: 'someposition' }),
    debtAmount: borrowAmount,
    collateralAmount: depositAmount,
    pool: pool,
  })

  it('should return undefined if mapping does not exist', () => {
    const executionStorageMapper = new ExecutionStorageMapper()

    const slot = executionStorageMapper.getOutputSlot({
      stepName: 'SwapStep',
      referenceName: 'fromTokenAmount',
    })

    expect(slot).toBeUndefined()
  })

  it('should add and retrieve storage slots, no reference values', () => {
    const derivedStep: steps.DepositBorrowStep = {
      type: SimulationSteps.DepositBorrow,
      name: 'DepositBorrowStep',
      inputs: {
        depositAmount: depositAmount,
        borrowAmount: borrowAmount,
        position: position,
      },
      outputs: {
        depositAmount: depositAmount,
        borrowAmount: borrowAmount,
      },
    }

    const executionStorageMapper = new ExecutionStorageMapper()

    const inputSlotsMapping = executionStorageMapper.addStorageMap({
      step: derivedStep,
      action: derivedAction,
      connectedInputs: {
        depositAmount: 'someInput1',
        borrowAmount: 'otherInput',
      },
      connectedOutputs: {
        depositAmount: 'otherOutput',
        borrowAmount: 'someOutput2',
      },
    })

    expect(inputSlotsMapping).toEqual([0, 0, 0, 0])

    {
      const slot = executionStorageMapper.getOutputSlot({
        stepName: 'DepositBorrowStep',
        referenceName: 'depositAmount',
      })

      const actionSlot =
        1 + derivedAction.config.storageOutputs.findIndex((input) => input === 'otherOutput')
      expect(slot).toBe(actionSlot)
    }
    {
      const slot = executionStorageMapper.getOutputSlot({
        stepName: 'DepositBorrowStep',
        referenceName: 'borrowAmount',
      })

      const actionSlot =
        1 + derivedAction.config.storageOutputs.findIndex((input) => input === 'someOutput2')
      expect(slot).toBe(actionSlot)
    }
  })

  it('should add and retrieve storage slots, reference values', () => {
    const previousStep: steps.DepositBorrowStep = {
      type: SimulationSteps.DepositBorrow,
      name: 'PreviousDepositBorrowStep',
      inputs: {
        depositAmount: depositAmount,
        borrowAmount: borrowAmount,
        position: position,
      },
      outputs: {
        depositAmount: depositAmount,
        borrowAmount: borrowAmount,
      },
    }

    const derivedStep: steps.DepositBorrowStep = {
      type: SimulationSteps.DepositBorrow,
      name: 'DepositBorrowStep',
      inputs: {
        depositAmount: {
          estimatedValue: depositAmount,
          path: ['PreviousDepositBorrowStep', 'depositAmount'],
        },
        borrowAmount: {
          estimatedValue: borrowAmount,
          path: ['PreviousDepositBorrowStep', 'borrowAmount'],
        },
        position: position,
      },
      outputs: {
        depositAmount: depositAmount,
        borrowAmount: borrowAmount,
      },
    }

    const executionStorageMapper = new ExecutionStorageMapper()

    executionStorageMapper.addStorageMap({
      step: previousStep,
      action: derivedAction,
      connectedInputs: {
        depositAmount: 'someInput1',
        borrowAmount: 'otherInput',
      },
      connectedOutputs: {
        depositAmount: 'otherOutput',
        borrowAmount: 'someOutput2',
      },
    })

    const inputSlotsMapping = executionStorageMapper.addStorageMap({
      step: derivedStep,
      action: derivedAction,
      connectedInputs: {
        depositAmount: 'someInput1',
        borrowAmount: 'otherInput',
      },
      connectedOutputs: {
        depositAmount: 'otherOutput',
        borrowAmount: 'someOutput2',
      },
    })

    expect(inputSlotsMapping).toEqual([3, 0, 2, 0])

    {
      const slot = executionStorageMapper.getOutputSlot({
        stepName: 'PreviousDepositBorrowStep',
        referenceName: 'depositAmount',
      })

      const actionSlot =
        1 + derivedAction.config.storageOutputs.findIndex((input) => input === 'otherOutput')
      expect(slot).toBe(actionSlot)
    }
    {
      const slot = executionStorageMapper.getOutputSlot({
        stepName: 'PreviousDepositBorrowStep',
        referenceName: 'borrowAmount',
      })

      const actionSlot =
        1 + derivedAction.config.storageOutputs.findIndex((input) => input === 'someOutput2')
      expect(slot).toBe(actionSlot)
    }
    {
      const slot = executionStorageMapper.getOutputSlot({
        stepName: 'DepositBorrowStep',
        referenceName: 'depositAmount',
      })

      const actionSlot =
        3 + derivedAction.config.storageOutputs.findIndex((input) => input === 'otherOutput')
      expect(slot).toBe(actionSlot)
    }
    {
      const slot = executionStorageMapper.getOutputSlot({
        stepName: 'DepositBorrowStep',
        referenceName: 'borrowAmount',
      })

      const actionSlot =
        3 + derivedAction.config.storageOutputs.findIndex((input) => input === 'someOutput2')
      expect(slot).toBe(actionSlot)
    }
  })

  it('should accept empty inputs and outputs', () => {
    const derivedStep: steps.DepositBorrowStep = {
      type: SimulationSteps.DepositBorrow,
      name: 'DepositBorrowStep',
      inputs: {
        depositAmount: {
          estimatedValue: depositAmount,
          path: ['PreviousDepositBorrowStep', 'depositAmount'],
        },
        borrowAmount: borrowAmount,
        position: position,
      },
      outputs: {
        depositAmount: depositAmount,
        borrowAmount: borrowAmount,
      },
    }

    const executionStorageMapper = new ExecutionStorageMapper()

    const inputSlotsMapping = executionStorageMapper.addStorageMap({
      step: derivedStep,
      action: derivedAction,
      connectedInputs: {},
      connectedOutputs: {},
    })

    expect(inputSlotsMapping).toEqual([0, 0, 0, 0])

    {
      const slot = executionStorageMapper.getOutputSlot({
        stepName: 'DepositBorrowStep',
        referenceName: 'depositAmount',
      })

      expect(slot).toBeUndefined()
    }
    {
      const slot = executionStorageMapper.getOutputSlot({
        stepName: 'DepositBorrowStep',
        referenceName: 'borrowAmount',
      })

      expect(slot).toBeUndefined()
    }
  })

  it('should throw when receiving an invalid value reference', () => {
    const derivedStep: steps.DepositBorrowStep = {
      type: SimulationSteps.DepositBorrow,
      name: 'DepositBorrowStep',
      inputs: {
        depositAmount: {
          estimatedValue: depositAmount,
          path: ['PreviousDepositBorrowStep', 'depositAmount'],
        },
        borrowAmount: {
          estimatedValue: borrowAmount,
          path: ['PreviousDepositBorrowStep', 'borrowAmount'],
        },
        position: position,
      },
      outputs: {
        depositAmount: depositAmount,
        borrowAmount: borrowAmount,
      },
    }

    const executionStorageMapper = new ExecutionStorageMapper()

    // Mocha needs a function to check throw errors
    expect(() =>
      executionStorageMapper.addStorageMap({
        step: derivedStep,
        action: derivedAction,
        connectedInputs: {
          depositAmount: 'someInput1',
          borrowAmount: 'otherInput',
        },
        connectedOutputs: {
          depositAmount: 'otherOutput',
          borrowAmount: 'someOutput2',
        },
      }),
    ).toThrow('Reference not found in storage: PreviousDepositBorrowStep-depositAmount')
  })

  it('should throw when receiving an invalid input names', () => {
    const previousStep: steps.DepositBorrowStep = {
      type: SimulationSteps.DepositBorrow,
      name: 'PreviousDepositBorrowStep',
      inputs: {
        depositAmount: depositAmount,
        borrowAmount: borrowAmount,
        position: position,
      },
      outputs: {
        depositAmount: depositAmount,
        borrowAmount: borrowAmount,
      },
    }

    const derivedStep: steps.DepositBorrowStep = {
      type: SimulationSteps.DepositBorrow,
      name: 'DepositBorrowStep',
      inputs: {
        depositAmount: {
          estimatedValue: depositAmount,
          path: ['PreviousDepositBorrowStep', 'depositAmount'],
        },
        borrowAmount: {
          estimatedValue: borrowAmount,
          path: ['PreviousDepositBorrowStep', 'borrowAmount'],
        },
        position: position,
      },
      outputs: {
        depositAmount: depositAmount,
        borrowAmount: borrowAmount,
      },
    }

    const executionStorageMapper = new ExecutionStorageMapper()

    executionStorageMapper.addStorageMap({
      step: previousStep,
      action: derivedAction,
      connectedInputs: {
        depositAmount: 'someInput1',
        borrowAmount: 'otherInput',
      },
      connectedOutputs: {
        depositAmount: 'otherOutput',
        borrowAmount: 'someOutput2',
      },
    })

    // Mocha needs a function to check throw errors
    expect(() =>
      executionStorageMapper.addStorageMap({
        step: derivedStep,
        action: derivedAction,
        connectedInputs: {
          depositAmount: 'inputDoesNotExist',
        },
        connectedOutputs: {},
      }),
    ).toThrow('Input not found in action storage inputs: inputDoesNotExist')
  })
})
