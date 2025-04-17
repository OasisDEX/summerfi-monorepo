import {
  IPoolIdData,
  LendingPosition,
  LendingPositionType,
  PoolType,
  ProtocolName,
} from '@summerfi/sdk-common'
import {
  Address,
  ChainFamilyMap,
  ChainInfo,
  IProtocol,
  PositionType,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common'
import { SimulationSteps, TokenTransferTargetType, steps } from '@summerfi/sdk-common'
import { DerivedAction } from '@summerfi/testing-utils/mocks/actions/DerivedAction'
import { StepBuilderContext } from '../src/context'

describe('Step Builder Context', () => {
  const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet

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

  const derivedAction = new DerivedAction()

  const otherActionCall = derivedAction.encodeCall({
    test1: '0x0000000000000000000000000000000000000999',
    test2: '0x0000000000000000000000000000000000000888',
    test3: BigInt(200),
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
    name: ProtocolName.Maker as const,
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  } as unknown as IProtocol

  const poolId: IPoolIdData = {
    type: PoolType.Lending,
    protocol: protocol,
  }

  const pool = {
    type: PoolType.Lending,
    protocol,
    poolId,
  }

  const position = {
    type: PositionType.Lending,
    subtype: LendingPositionType.Multiply,
    positionId: { id: 'someposition' },
    debtAmount: borrowAmount,
    collateralAmount: depositAmount,
    pool: pool,
  } as unknown as LendingPosition

  it('should not allow adding calls without subcontext', () => {
    const stepBuilderContext = new StepBuilderContext()

    const derivedStep: steps.DepositBorrowStep = {
      type: SimulationSteps.DepositBorrow,
      name: 'DepositBorrowStep',
      inputs: {
        depositAmount: depositAmount,
        borrowAmount: borrowAmount,
        position: position,
        borrowTargetType: TokenTransferTargetType.PositionsManager,
      },
      outputs: {
        depositAmount: depositAmount,
        borrowAmount: borrowAmount,
      },
    }

    expect(stepBuilderContext.subContextLevels).toBe(0)

    expect(() => {
      stepBuilderContext.addActionCall({
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
    const stepBuilderContext = new StepBuilderContext()

    stepBuilderContext.startSubContext()

    expect(stepBuilderContext.subContextLevels).toBe(1)

    const { customData } = stepBuilderContext.endSubContext<string>()

    expect(customData).toBeUndefined()

    expect(stepBuilderContext.subContextLevels).toBe(0)
  })

  it('should add action calls', () => {
    const stepBuilderContext = new StepBuilderContext()

    const derivedStep: steps.DepositBorrowStep = {
      type: SimulationSteps.DepositBorrow,
      name: 'DepositBorrowStep',
      inputs: {
        depositAmount: depositAmount,
        borrowAmount: borrowAmount,
        position: position,
        borrowTargetType: TokenTransferTargetType.PositionsManager,
      },
      outputs: {
        depositAmount: depositAmount,
        borrowAmount: borrowAmount,
      },
    }

    stepBuilderContext.startSubContext({ customData: 'level1' })

    expect(stepBuilderContext.subContextLevels).toBe(1)

    stepBuilderContext.addActionCall({
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

    const { callsBatch, customData } = stepBuilderContext.endSubContext<string>()

    const actionCall = derivedAction.encodeCall(
      {
        test1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        test2: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        test3: BigInt(100),
      },
      [0, 0, 0, 0],
    )

    expect(callsBatch).toEqual([actionCall])
    expect(customData).toBe('level1')
    expect(stepBuilderContext.subContextLevels).toBe(0)
  })
})
