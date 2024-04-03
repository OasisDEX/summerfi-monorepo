import {
  FlashloanProvider,
  ISimulation,
  PositionType,
  SimulationSteps,
  SimulationType,
  TokenTransferTargetType,
} from '@summerfi/sdk-common/simulation'
import { Simulator } from '../../implementation/simulator-engine'
import { Position, TokenAmount } from '@summerfi/sdk-common/common'
import { newEmptyPositionFromPool } from '@summerfi/sdk-common/common/utils'
import { IRefinanceParameters } from '@summerfi/sdk-common/orders'
import { isLendingPool } from '@summerfi/sdk-common/protocols'
import { refinanceLendingToLendingSamePairStrategy } from './Strategy'
import { type IRefinanceDependencies } from '../common/Types'

export async function refinanceLendingToLendingSamePair(
  args: IRefinanceParameters,
  dependencies: IRefinanceDependencies,
): Promise<ISimulation<SimulationType.Refinance>> {
  // args validation
  if (!isLendingPool(args.targetPool)) {
    throw new Error('Target pool is not a lending pool')
  }

  const position = Position.createFrom(args.position)
  const targetPool = await dependencies.protocolManager.getPool(args.targetPool.poolId)

  if (!isLendingPool(targetPool)) {
    throw new Error('Target pool is not a lending pool')
  }

  const FLASHLOAN_MARGIN = 1.001
  const flashloanAmount = position.debtAmount.multiply(FLASHLOAN_MARGIN)
  const simulator = Simulator.create(refinanceLendingToLendingSamePairStrategy)

  const targetTokenConfig = targetPool.collaterals.get({ token: position.collateralAmount.token })
  if (!targetTokenConfig) {
    throw new Error('Target token not found in pool')
  }

  // TODO: read debt amount from chain (special step: ReadDebtAmount)
  // TODO: the swap quote should also include the summer fee, in this case we need to know when we are taking the fee,
  // before or after the swap, it influences actual call to oneInch api
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
      name: 'PaybackWithdrawFromSource',
      type: SimulationSteps.PaybackWithdraw,
      inputs: {
        paybackAmount: TokenAmount.createFrom({
          amount: Number.MAX_SAFE_INTEGER.toString(),
          token: position.debtAmount.token,
        }),
        withdrawAmount: position.collateralAmount,
        position: position,
      },
    }))
    .next(async (ctx) => ({
      name: 'DepositBorrowToTarget',
      type: SimulationSteps.DepositBorrow,
      inputs: {
        depositAmount: ctx.getReference(['PaybackWithdrawFromSource', 'withdrawAmount']),
        borrowAmount: position.debtAmount, // TODO figure the debt amount
        position: newEmptyPositionFromPool(
          targetPool,
          position.debtAmount.token,
          position.collateralAmount.token,
        ),
        borrowTargetType: TokenTransferTargetType.PositionsManager,
      },
    }))
    .next(async () => ({
      name: 'RepayFlashloan',
      type: SimulationSteps.RepayFlashloan,
      inputs: {
        amount: flashloanAmount,
      },
    }))
    .next(async (ctx) => {
      // TODO: we should have a way to get the target position more easily and realiably,
      const targetPosition = Object.values(ctx.state.positions).find(
        (p) => p.pool.protocol === targetPool.protocol,
      )
      if (!targetPosition) {
        throw new Error('Target position not found')
      }

      return {
        name: 'NewPositionEvent',
        type: SimulationSteps.NewPositionEvent,
        inputs: {
          position: targetPosition,
          positionType: PositionType.Refinance,
        },
      }
    })
    .run()

  const targetPosition = Object.values(simulation.positions).find(
    (p) => p.pool.protocol === targetPool.protocol,
  )

  if (!targetPosition) {
    throw new Error('Target position not found')
  }

  return {
    simulationType: SimulationType.Refinance,
    sourcePosition: position,
    targetPosition,
    swaps: Object.values(simulation.swaps),
    steps: Object.values(simulation.steps),
  } as ISimulation<SimulationType.Refinance>
}
