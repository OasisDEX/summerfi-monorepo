import {
  Address,
  ChainFamilyMap,
  ChainInfo,
  PoolType,
  PositionType,
  ProtocolName,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common/common'
import { LendingPositionType } from '@summerfi/sdk-common/lending-protocols'
import { SimulationSteps, TokenTransferTargetType, steps } from '@summerfi/sdk-common/simulation'
import { getErrorMessage } from '@summerfi/testing-utils'
import assert from 'assert'
import {
  EmodeType,
  ILKType,
  MakerLendingPool,
  MakerLendingPoolId,
  MakerLendingPosition,
  MakerLendingPositionId,
  MakerProtocol,
  SparkDepositBorrowActionBuilder,
  SparkLendingPool,
  SparkLendingPoolId,
  SparkLendingPosition,
  SparkProtocol,
} from '../../../../src'
import { SetupBuilderReturnType, setupBuilderParams } from '../../../utils/SetupBuilderParams'

describe('Spark  Deposit Borrow Action Builder', () => {
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

  const DAI = Token.createFrom({
    chainInfo,
    address: Address.createFromEthereum({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
  })

  const depositAmount = TokenAmount.createFrom({
    token: WETH,
    amount: '134.5',
  })

  const borrowAmount = TokenAmount.createFrom({
    token: DAI,
    amount: '1000',
  })

  const protocol = SparkProtocol.createFrom({
    name: ProtocolName.Spark,
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  })

  const poolId = SparkLendingPoolId.createFrom({
    protocol: protocol,
    collateralToken: WETH,
    debtToken: DAI,
    emodeType: EmodeType.None,
  })

  const pool = SparkLendingPool.createFrom({
    collateralToken: WETH,
    debtToken: DAI,
    id: poolId,
    type: PoolType.Lending,
  })

  const position = SparkLendingPosition.createFrom({
    type: PositionType.Lending,
    subtype: LendingPositionType.Multiply,
    id: MakerLendingPositionId.createFrom({
      type: PositionType.Lending,
      id: 'someposition',
      vaultId: '123',
    }),
    debtAmount: borrowAmount,
    collateralAmount: depositAmount,
    pool: pool,
  })

  const wrongPosition = MakerLendingPosition.createFrom({
    type: PositionType.Lending,
    subtype: LendingPositionType.Multiply,
    id: MakerLendingPositionId.createFrom({
      type: PositionType.Lending,
      id: 'someposition',
      vaultId: '123',
    }),
    debtAmount: borrowAmount,
    collateralAmount: depositAmount,
    pool: MakerLendingPool.createFrom({
      collateralToken: WETH,
      debtToken: DAI,
      id: MakerLendingPoolId.createFrom({
        collateralToken: WETH,
        debtToken: DAI,
        protocol: MakerProtocol.createFrom({
          name: ProtocolName.Maker,
          chainInfo: ChainFamilyMap.Ethereum.Mainnet,
        }),
        ilkType: ILKType.ETH_A,
      }),
      type: PoolType.Lending,
    }),
  })

  const derivedStep: steps.DepositBorrowStep = {
    type: SimulationSteps.DepositBorrow,
    name: 'DepositBorrowStep',
    inputs: {
      depositAmount: depositAmount,
      borrowAmount: borrowAmount,
      position: position,
      borrowTargetType: TokenTransferTargetType.StrategyExecutor,
    },
    outputs: {
      depositAmount: depositAmount,
      borrowAmount: borrowAmount,
    },
  }

  beforeEach(() => {
    builderParams = setupBuilderParams({ chainInfo: ChainFamilyMap.Ethereum.Mainnet })
  })

  it('should fail the position is not a Spark one', async () => {
    try {
      await new SparkDepositBorrowActionBuilder().build({
        ...builderParams,
        step: {
          ...derivedStep,
          inputs: {
            ...derivedStep.inputs,
            position: wrongPosition,
          },
        },
        protocolsRegistry: builderParams.emptyProtocolsRegistry,
      })
      assert.fail('Should have thrown an error')
    } catch (error: unknown) {
      expect(getErrorMessage(error)).toEqual('Invalid Spark lending pool')
    }
  })

  it('should add all the action calls', async () => {
    builderParams.context.startSubContext()

    await new SparkDepositBorrowActionBuilder().build({
      ...builderParams,
      step: derivedStep,
      protocolsRegistry: builderParams.emptyProtocolsRegistry,
    })

    const { callsBatch } = builderParams.context.endSubContext()

    expect(callsBatch.length).toEqual(3)

    expect(callsBatch[0].name).toBe('SetApproval')
    expect(callsBatch[1].name).toBe('SparkDeposit')
    expect(callsBatch[2].name).toBe('SparkBorrow')
  })

  it('should not add borrow nor send token when borrow amount is 0', async () => {
    builderParams.context.startSubContext()

    await new SparkDepositBorrowActionBuilder().build({
      ...builderParams,
      step: {
        ...derivedStep,
        inputs: {
          ...derivedStep.inputs,
          borrowAmount: TokenAmount.createFrom({
            token: DAI,
            amount: '0',
          }),
        },
      },
      protocolsRegistry: builderParams.emptyProtocolsRegistry,
    })

    const { callsBatch } = builderParams.context.endSubContext()

    expect(callsBatch.length).toEqual(3)

    expect(callsBatch[0].name).toBe('SetApproval')
    expect(callsBatch[1].name).toBe('SparkDeposit')
    expect(callsBatch[2].name).toBe('SparkBorrow')
  })

  it('should add borrow but not send token when borrow target is positions manager', async () => {
    builderParams.context.startSubContext()

    await new SparkDepositBorrowActionBuilder().build({
      ...builderParams,
      step: {
        ...derivedStep,
        inputs: {
          ...derivedStep.inputs,
          borrowTargetType: TokenTransferTargetType.PositionsManager,
        },
      },
      protocolsRegistry: builderParams.emptyProtocolsRegistry,
    })

    const { callsBatch } = builderParams.context.endSubContext()

    expect(callsBatch.length).toEqual(3)

    expect(callsBatch[0].name).toBe('SetApproval')
    expect(callsBatch[1].name).toBe('SparkDeposit')
    expect(callsBatch[2].name).toBe('SparkBorrow')
  })
})
