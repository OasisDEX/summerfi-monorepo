import {
  Address,
  ChainFamilyMap,
  ChainInfo,
  Percentage,
  PositionType,
  RiskRatio,
  RiskRatioType,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common/common'
import { SimulationSteps, TokenTransferTargetType, steps } from '@summerfi/sdk-common/simulation'
import { SetupBuilderReturnType, setupBuilderParams } from '../../../utils/SetupBuilderParams'
import { PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
import { getErrorMessage } from '@summerfi/testing-utils'
import assert from 'assert'
import {
  ILKType,
  MakerLendingPool,
  MakerLendingPoolId,
  MakerPosition,
  MakerPositionId,
  MakerProtocol,
  MorphoDepositBorrowActionBuilder,
  MorphoLendingPool,
  MorphoLendingPoolId,
  MorphoPosition,
  MorphoPositionId,
  MorphoProtocol,
} from '../../../../src'

describe('Morpho  Deposit Borrow Action Builder', () => {
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

  const protocol = MorphoProtocol.createFrom({
    name: ProtocolName.MorphoBlue,
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  })

  const poolId = MorphoLendingPoolId.createFrom({
    marketId: '0x1234',
    protocol: protocol,
  })

  const pool = MorphoLendingPool.createFrom({
    collateralToken: WETH,
    debtToken: DAI,
    id: poolId,
    irm: Address.createFromEthereum({ value: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' }),
    oracle: Address.createFromEthereum({ value: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' }),
    lltv: RiskRatio.createFrom({
      value: Percentage.createFrom({ value: 0.5 }),
      type: RiskRatioType.LTV,
    }),
    type: PoolType.Lending,
  })

  const position = MorphoPosition.createFrom({
    type: PositionType.Multiply,
    id: MorphoPositionId.createFrom({ id: 'someposition' }),
    debtAmount: borrowAmount,
    collateralAmount: depositAmount,
    pool: pool,
  })

  const wrongPosition = MakerPosition.createFrom({
    type: PositionType.Multiply,
    id: MakerPositionId.createFrom({ id: 'someposition', vaultId: '123' }),
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

  it('should fail the position is not a Morpho one', async () => {
    try {
      await new MorphoDepositBorrowActionBuilder().build({
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
      expect(getErrorMessage(error)).toEqual('Invalid Morpho lending pool id')
    }
  })

  it('should add all the action calls', async () => {
    builderParams.context.startSubContext()

    await new MorphoDepositBorrowActionBuilder().build({
      ...builderParams,
      step: derivedStep,
      protocolsRegistry: builderParams.emptyProtocolsRegistry,
    })

    const { callsBatch } = builderParams.context.endSubContext()

    expect(callsBatch.length).toEqual(4)

    expect(callsBatch[0].name).toBe('SetApproval')
    expect(callsBatch[1].name).toBe('MorphoBlueDeposit')
    expect(callsBatch[2].name).toBe('MorphoBlueBorrow')
    expect(callsBatch[3].name).toBe('SendToken')
  })

  it('should not add borrow nor send token when borrow amount is 0', async () => {
    builderParams.context.startSubContext()

    await new MorphoDepositBorrowActionBuilder().build({
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

    expect(callsBatch.length).toEqual(2)

    expect(callsBatch[0].name).toBe('SetApproval')
    expect(callsBatch[1].name).toBe('MorphoBlueDeposit')
  })

  it('should add borrow but not send token when borrow target is positions manager', async () => {
    builderParams.context.startSubContext()

    await new MorphoDepositBorrowActionBuilder().build({
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
    expect(callsBatch[1].name).toBe('MorphoBlueDeposit')
    expect(callsBatch[2].name).toBe('MorphoBlueBorrow')
  })
})
