import {
  SDKError,
  SDKErrorType,
  isLendingPosition,
  CommonTokenSymbols,
  Percentage,
  TokenAmount,
  isLendingPool,
  IRefinanceParameters,
  FlashloanProvider,
  IRefinanceSimulation,
  RefinanceSimulation,
  SimulationSteps,
  TokenTransferTargetType,
  getValueFromReference,
} from '@summerfi/sdk-common'
import { Simulator } from '../../implementation/simulator-engine'
import { estimateSwapFromAmount } from '../../implementation/utils/EstimateSwapFromAmount'
import { getSwapStepData } from '../../implementation/utils/GetSwapStepData'
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

  const FLASHLOAN_MARGIN = 1.001
  const flashloanAmount = position.debtAmount.multiply(FLASHLOAN_MARGIN)
  const simulator = Simulator.create(refinanceLendingToLendingAnyPairStrategy)

  const isCollateralSwapSkipped = targetPool.collateralToken.equals(sourcePool.collateralToken)
  const isDebtAmountZero = position.debtAmount.isZero()
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
        type: SimulationSteps.Flashloan,
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
        type: SimulationSteps.Flashloan,
      },
    )
    .next(async () => ({
      name: 'PaybackWithdrawFromSourcePosition',
      type: SimulationSteps.PaybackWithdraw,
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
        type: SimulationSteps.Swap,
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
        type: SimulationSteps.Swap,
      },
    )
    .next(async () => ({
      name: 'OpenTargetPosition',
      type: SimulationSteps.OpenPosition,
      inputs: {
        pool: targetPool,
      },
    }))
    .next(async (ctx) => ({
      name: 'DepositBorrowToTargetPosition',
      type: SimulationSteps.DepositBorrow,
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
        type: SimulationSteps.Swap,
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
        type: SimulationSteps.Swap,
      },
    )
    .next(
      async () => ({
        name: 'RepayFlashloan',
        type: SimulationSteps.RepayFlashloan,
        inputs: {
          amount: flashloanAmount,
        },
      }),
      {
        skip: isDebtAmountZero,
        type: SimulationSteps.RepayFlashloan,
      },
    )
    .next(
      async () => ({
        name: 'ReturnFunds',
        type: SimulationSteps.ReturnFunds,
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
        type: SimulationSteps.ReturnFunds,
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
        type: SimulationSteps.NewPositionEvent,
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
