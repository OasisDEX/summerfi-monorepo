import {
  ISimulation,
  SimulationSteps,
  SimulationType,
  TokenTransferTargetType,
  getValueFromReference,
} from '@summerfi/sdk-common/simulation'
import { Simulator } from '../../implementation/simulator-engine'
import { Percentage, TokenAmount } from '@summerfi/sdk-common/common'
import { IRefinanceParameters } from '@summerfi/sdk-common/orders'
import { isLendingPool } from '@summerfi/sdk-common/protocols'
import { refinanceLendingToLendingNoDebtStrategy } from './Strategy'
import { type IRefinanceDependencies } from '../common/Types'
import { getSwapStepData } from '../../implementation/utils/GetSwapStepData'

export async function refinanceLendingToLendingNoDebt(
  args: IRefinanceParameters,
  dependencies: IRefinanceDependencies,
): Promise<
  ISimulation<SimulationType.RefinanceNoDebt | SimulationType.RefinanceNoDebtDifferentCollateral>
> {
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

  if (!isLendingPool(targetPool)) {
    throw new Error('Target pool is not a lending pool')
  }
  const simulator = Simulator.create(refinanceLendingToLendingNoDebtStrategy)

  const zeroAmount = TokenAmount.createFromBaseUnit({
    token: position.debtAmount.token,
    amount: '0',
  })

  const isCollateralSwapSkipped = targetPool.collateralToken.equals(sourcePool.collateralToken)

  const simulation = await simulator
    .next(async () => ({
      name: 'PaybackWithdrawFromSourcePosition',
      type: SimulationSteps.PaybackWithdraw,
      inputs: {
        paybackAmount: zeroAmount,
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
        depositAmount: isCollateralSwapSkipped
          ? position.collateralAmount
          : ctx.getReference(['SwapCollateralFromSourcePosition', 'received']),
        borrowAmount: TokenAmount.createFrom({
          amount: '0',
          token: targetPool.debtToken,
        }),
        position: getValueFromReference(ctx.getReference(['OpenTargetPosition', 'position'])),
        borrowTargetType: TokenTransferTargetType.PositionsManager,
      },
    }))
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

  return {
    simulationType: isCollateralSwapSkipped
      ? SimulationType.RefinanceNoDebt
      : SimulationType.RefinanceNoDebtDifferentCollateral,
    sourcePosition: position,
    targetPosition,
    swaps: Object.values(simulation.swaps),
    steps: Object.values(simulation.steps),
  }
}