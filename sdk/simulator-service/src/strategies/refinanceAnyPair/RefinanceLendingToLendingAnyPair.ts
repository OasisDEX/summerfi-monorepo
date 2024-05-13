import {
  FlashloanProvider,
  ISimulation,
  RefinanceSimulationTypes,
  SimulationSteps,
  TokenTransferTargetType,
  getValueFromReference,
} from '@summerfi/sdk-common/simulation'
import { Simulator } from '../../implementation/simulator-engine'
import { Position, TokenAmount, Percentage } from '@summerfi/sdk-common/common'
import { IRefinanceParameters } from '@summerfi/sdk-common/orders'
import { isLendingPool } from '@summerfi/sdk-common/protocols'
import { refinanceLendingToLendingAnyPairStrategy } from './Strategy'
import { type IRefinanceDependencies } from '../common/Types'
import { getSwapStepData } from '../../implementation/utils/GetSwapStepData'
import { getRefinanceSimulationType } from '../../implementation/utils/GetRefinanceSimulationType'
import { estimateSwapFromAmount } from '../../implementation/utils/EstimateSwapFromAmount'

export async function refinanceLendingToLendingAnyPair(
  args: IRefinanceParameters,
  dependencies: IRefinanceDependencies,
): Promise<ISimulation<RefinanceSimulationTypes>> {
  // args validation
  if (!isLendingPool(args.targetPosition.pool)) {
    throw new Error('Target pool is not a lending pool')
  }

  const position = args.sourcePosition as Position
  const sourcePool = await dependencies.protocolManager.getLendingPool(args.sourcePosition.pool.id)
  const targetPool = await dependencies.protocolManager.getLendingPool(args.targetPosition.pool.id)

  if (!isLendingPool(sourcePool)) {
    throw new Error('Source pool is not a lending pool')
  }

  if (!isLendingPool(targetPool)) {
    throw new Error('Target pool is not a lending pool')
  }

  const FLASHLOAN_MARGIN = 1.001
  const flashloanAmount = position.debtAmount.multiply(FLASHLOAN_MARGIN)
  const simulator = Simulator.create(refinanceLendingToLendingAnyPairStrategy)

  const isCollateralSwapSkipped = !targetPool.id.collateralToken.equals(
    sourcePool.id.collateralToken,
  )
  const isDebtSwapSkipped = !targetPool.id.debtToken.equals(sourcePool.id.debtToken)

  const simulation = await simulator
    .next(async () => ({
      name: 'Flashloan',
      type: SimulationSteps.Flashloan,
      inputs: {
        amount: flashloanAmount,
        provider: FlashloanProvider.Maker,
      },
    }))
    .next(async () => ({
      name: 'PaybackWithdrawFromSourcePosition',
      type: SimulationSteps.PaybackWithdraw,
      inputs: {
        paybackAmount: TokenAmount.createFrom({
          amount: Number.MAX_SAFE_INTEGER.toString(),
          token: position.debtAmount.token,
        }),
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
          toToken: targetPool.id.collateralToken,
          slippage: Percentage.createFrom({ value: args.slippage.value }),
          swapManager: dependencies.swapManager,
          oracleManager: dependencies.oracleManager,
        }),
      }),
      isCollateralSwapSkipped,
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
        // refactor
        borrowAmount: isDebtSwapSkipped
          ? ctx.getReference(['SwapCollateralFromSourcePosition', 'received'])
          : await estimateSwapFromAmount({
              receiveAtLeast: flashloanAmount,
              fromToken: targetPool.id.debtToken,
              slippage: Percentage.createFrom(args.slippage),
              swapManager: dependencies.swapManager,
              oracleManager: dependencies.oracleManager,
            }),
        depositAmount: isCollateralSwapSkipped
          ? position.collateralAmount
          : ctx.getReference(['SwapCollateralFromSourcePosition', 'received']),
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
      isDebtSwapSkipped,
    )
    .next(async () => ({
      name: 'RepayFlashloan',
      type: SimulationSteps.RepayFlashloan,
      inputs: {
        amount: flashloanAmount,
      },
    }))
    .next(async () => ({
      name: 'ReturnFunds',
      type: SimulationSteps.ReturnFunds,
      inputs: {
        /*
         * We swap back to the original position's debt in order to repay the flashloan.
         * Therefore, the dust amount will be in the original position's debt
         * */
        token: position.debtAmount.token,
      },
    }))
    .next(async (ctx) => {
      // TODO: we should have a way to get the target position more easily and realiably,
      const targetPosition = Object.values(ctx.state.positions).find((p) =>
        p.pool.id.protocol.equals(targetPool.id.protocol),
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

  return {
    simulationType: getRefinanceSimulationType(!isCollateralSwapSkipped, !isDebtSwapSkipped),
    sourcePosition: position,
    targetPosition,
    swaps: simulation.swaps,
    steps: simulation.steps,
  } satisfies ISimulation<RefinanceSimulationTypes>
}
