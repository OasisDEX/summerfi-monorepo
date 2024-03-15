import { BaseAction } from '../src/actions/BaseAction'
import { ActionCall } from '../src/actions'
import { OrderPlannerContext } from '../src/context'
import {
  Address,
  ChainInfo,
  Position,
  PositionId,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common/common'
import { ChainFamilyMap } from '@summerfi/sdk-client'
import { MakerPoolId, PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'

class DerivedAction extends BaseAction {
  public readonly config = {
    name: 'PullToken',
    version: 8,
    parametersAbi: 'address, address, uint256',
    storageInputs: ['someInput1', 'someInput2', 'otherInput'],
    storageOutputs: ['someOutput1', 'someOutput2', 'otherOutput'],
  }

  public encodeCall(
    params: { test1: string; test2: string; test3: number },
    paramsMapping?: number[],
  ): ActionCall {
    return this._encodeCall({
      arguments: [params.test1, params.test2, params.test3],
      mapping: paramsMapping,
    })
  }
}

describe('Order Planner Context', () => {
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

  const otherActionCall = derivedAction.encodeCall({
    test1: '0x0000000000000000000000000000000000000999',
    test2: '0x0000000000000000000000000000000000000888',
    test3: 200,
  })

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

  it('should not allow adding calls without subcontext', () => {
    const orderPlannerContext = new OrderPlannerContext()

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

    expect(orderPlannerContext.subContextLevels).toBe(0)

    expect(() => {
      orderPlannerContext.addActionCall({
        step: derivedStep,
        action: derivedAction,
        arguments: {
          test1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          test2: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          test3: 100,
        },
        connectedInputs: {
          depositAmount: 'someInput1',
          borrowAmount: 'otherInput',
        },
        connectedOutputs: {
          depositAmount: 'otherOutput',
          borrowAmount: 'someOutput2',
        },
      })
    }).toThrow('Cannot add a call outside of a subcontext')
  })

  it('should allow empty custom data on subcontext', () => {
    const orderPlannerContext = new OrderPlannerContext()

    orderPlannerContext.startSubContext()

    expect(orderPlannerContext.subContextLevels).toBe(1)

    const { customData } = orderPlannerContext.endSubContext<string>()

    expect(customData).toBeUndefined()

    expect(orderPlannerContext.subContextLevels).toBe(0)
  })

  it('should add action calls', () => {
    const orderPlannerContext = new OrderPlannerContext()

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

    orderPlannerContext.startSubContext({ customData: 'level1' })

    expect(orderPlannerContext.subContextLevels).toBe(1)

    orderPlannerContext.addActionCall({
      step: derivedStep,
      action: derivedAction,
      arguments: {
        test1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        test2: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        test3: 100,
      },
      connectedInputs: {
        depositAmount: 'someInput1',
        borrowAmount: 'otherInput',
      },
      connectedOutputs: {
        depositAmount: 'otherOutput',
        borrowAmount: 'someOutput2',
      },
    })

    const { callsBatch, customData } = orderPlannerContext.endSubContext<string>()

    const actionCall = derivedAction.encodeCall(
      {
        test1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        test2: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        test3: 100,
      },
      [0, 0, 0, 0],
    )

    expect(callsBatch).toEqual([actionCall])
    expect(customData).toBe('level1')
    expect(orderPlannerContext.subContextLevels).toBe(0)
  })
})
