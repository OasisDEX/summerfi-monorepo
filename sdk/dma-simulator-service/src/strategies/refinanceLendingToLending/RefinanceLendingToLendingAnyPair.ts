import { SDKError, SDKErrorType, isLendingPosition } from '@summerfi/sdk-common'
import { CommonTokenSymbols, Percentage, TokenAmount } from '@summerfi/sdk-common/common'
import { isLendingPool } from '@summerfi/sdk-common/lending-protocols'
import { IRefinanceParameters } from '@summerfi/sdk-common/orders'
import { FlashloanProvider } from '@summerfi/sdk-common/simulation'
import { Simulator } from '@summerfi/simulator-common'
import { getValueFromReference } from '@summerfi/simulator-common/utils'
import { DMASimulatorStepsTypes } from '../../enums/DMASimulatorStepsTypes'
import { DMAStateReducers } from '../../implementation/DMAStateReducers'
import { DMAStepOutputProcessors } from '../../implementation/DMAStepOutputProcessors'
import { RefinanceSimulation } from '../../implementation/simulations/RefinanceSimulation'
import { DMASimulatorConfig } from '../../interfaces/DMASimulatorConfig'
import { IRefinanceSimulation } from '../../interfaces/IRefinanceSimulation'
import { TokenTransferTargetType } from '../../types/TokenTransferTargetType'
import { estimateSwapFromAmount } from '../../utils/EstimateSwapFromAmount'
import { getSwapStepData } from '../../utils/GetSwapStepData'
import { type IRefinanceDependencies } from '../common/Types'
import { refinanceLendingToLendingAnyPairStrategy } from './Strategy'

export async function refinanceLendingToLending(
  args: IRefinanceParameters,
  dependencies: IRefinanceDependencies,
): Promise<IRefinanceSimulation> {
  // args validation
  if (!isLendingPool(args.sourcePosition.pool)) {
    throw new Error('Source pool is not a lending pool')
  }
  if (!isLendingPool(args.targetPool)) {
    throw new Error('Target pool is not a lending pool')
  }

  const position = args.sourcePosition
  const sourcePool = args.sourcePosition.pool
  const targetPool = args.targetPool

  if (!isLendingPosition(position)) {
    throw SDKError.createFrom({
      type: SDKErrorType.Simulator,
      reason: 'Invalid position',
      message: 'Source position is not a lending position',
    })
  }
  if (!isLendingPool(sourcePool)) {
    throw new Error('Source pool is not a lending pool')
  }

  if (!isLendingPool(targetPool)) {
    throw new Error('Target pool is not a lending pool')
  }

  const simulatorConfig: DMASimulatorConfig = {
    schema: refinanceLendingToLendingAnyPairStrategy,
    outputProcessors: DMAStepOutputProcessors,
    stateReducers: DMAStateReducers,
    state: {
      swaps: [],
      balances: {},
      positions: {},
      steps: [],
    },
  }

  const FLASHLOAN_MARGIN = 1.001
  const flashloanAmount = position.debtAmount.multiply(FLASHLOAN_MARGIN)
  const simulator = Simulator.create(simulatorConfig)

  const isCollateralSwapSkipped = targetPool.collateralToken.equals(sourcePool.collateralToken)
  const isDebtAmountZero = position.debtAmount.toBaseUnit() === '0'
  const isDebtTokenSame = targetPool.debtToken.equals(sourcePool.debtToken)
  const isDebtSwapSkipped = isDebtTokenSame || isDebtAmountZero

  const maxDebtAmount = TokenAmount.createFrom({
    token: position.debtAmount.token,
    amount: Number.MAX_SAFE_INTEGER.toString(),
  })

  const simulation = await simulator
    .next(
      async () => ({
        name: 'Flashloan',
        type: DMASimulatorStepsTypes.Flashloan,
        inputs: {
          amount: flashloanAmount,
          provider:
            flashloanAmount.token.symbol === CommonTokenSymbols.DAI
              ? FlashloanProvider.Maker
              : FlashloanProvider.Balancer,
        },
      }),
      {
        skip: isDebtAmountZero,
        type: DMASimulatorStepsTypes.Flashloan,
      },
    )
    .next(async () => ({
      name: 'PaybackWithdrawFromSourcePosition',
      type: DMASimulatorStepsTypes.PaybackWithdraw,
      inputs: {
        paybackAmount: isDebtAmountZero ? position.debtAmount : maxDebtAmount,
        withdrawAmount: position.collateralAmount,
        position: position,
        withdrawTargetType: TokenTransferTargetType.PositionsManager,
      },
    }))
    .next(
      async () => ({
        name: 'SwapCollateralFromSourcePosition',
        type: DMASimulatorStepsTypes.Swap,
        inputs: await getSwapStepData({
          chainInfo: position.pool.id.protocol.chainInfo,
          fromAmount: position.collateralAmount,
          toToken: targetPool.collateralToken,
          slippage: Percentage.createFrom({ value: args.slippage.value }),
          swapManager: dependencies.swapManager,
          oracleManager: dependencies.oracleManager,
        }),
      }),
      {
        skip: isCollateralSwapSkipped,
        type: DMASimulatorStepsTypes.Swap,
      },
    )
    .next(async () => ({
      name: 'OpenTargetPosition',
      type: DMASimulatorStepsTypes.OpenPosition,
      inputs: {
        pool: targetPool,
      },
    }))
    .next(async (ctx) => ({
      name: 'DepositBorrowToTargetPosition',
      type: DMASimulatorStepsTypes.DepositBorrow,
      inputs: {
        depositAmount: isCollateralSwapSkipped
          ? position.collateralAmount
          : ctx.getReference(['SwapCollateralFromSourcePosition', 'received']),
        borrowAmount: isDebtTokenSame
          ? flashloanAmount
          : await estimateSwapFromAmount({
              receiveAtLeast: flashloanAmount,
              fromToken: targetPool.debtToken,
              slippage: Percentage.createFrom(args.slippage),
              swapManager: dependencies.swapManager,
              oracleManager: dependencies.oracleManager,
            }),

        position: getValueFromReference(ctx.getReference(['OpenTargetPosition', 'position'])),
        borrowTargetType: TokenTransferTargetType.PositionsManager,
      },
    }))
    .next(
      async (ctx) => ({
        name: 'SwapDebtFromTargetPosition',
        type: DMASimulatorStepsTypes.Swap,
        inputs: await getSwapStepData({
          chainInfo: position.pool.id.protocol.chainInfo,
          fromAmount: getValueFromReference(
            ctx.getReference(['DepositBorrowToTargetPosition', 'borrowAmount']),
          ),
          toToken: flashloanAmount.token,
          slippage: Percentage.createFrom({ value: args.slippage.value }),
          swapManager: dependencies.swapManager,
          oracleManager: dependencies.oracleManager,
        }),
      }),
      {
        skip: isDebtSwapSkipped,
        type: DMASimulatorStepsTypes.Swap,
      },
    )
    .next(
      async () => ({
        name: 'RepayFlashloan',
        type: DMASimulatorStepsTypes.RepayFlashloan,
        inputs: {
          amount: flashloanAmount,
        },
      }),
      {
        skip: isDebtAmountZero,
        type: DMASimulatorStepsTypes.RepayFlashloan,
      },
    )
    .next(
      async () => ({
        name: 'ReturnFunds',
        type: DMASimulatorStepsTypes.ReturnFunds,
        inputs: {
          /*
           * We swap back to the original position's debt in order to repay the flashloan.
           * Therefore, the dust amount will be in the original position's debt
           * */
          token: position.debtAmount.token,
        },
      }),
      {
        skip: isDebtSwapSkipped,
        type: DMASimulatorStepsTypes.ReturnFunds,
      },
    )
    .next(async (ctx) => {
      const targetPosition = getValueFromReference(
        ctx.getReference(['OpenTargetPosition', 'position']),
      )
      if (!targetPosition) {
        throw new Error('Target position not found')
      }

      return {
        name: 'NewPositionEvent',
        type: DMASimulatorStepsTypes.NewPositionEvent,
        inputs: {
          position: targetPosition,
        },
      }
    })
    .run()

  const targetPositionId = getValueFromReference(
    simulation.getReference(['OpenTargetPosition', 'position']),
  )
  const targetPosition = Object.values(simulation.positions).find(
    (p) => p.id.id === targetPositionId.id.id,
  )

  if (!targetPosition) {
    throw new Error('Target position not found')
  }

  return RefinanceSimulation.createFrom({
    sourcePosition: position,
    targetPosition: targetPosition,
    swaps: simulation.swaps,
    steps: simulation.steps,
  })
}
