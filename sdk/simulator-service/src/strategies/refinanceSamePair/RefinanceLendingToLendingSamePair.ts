import {
  FlashloanProvider,
  ISimulation,
  SimulationSteps,
  SimulationType,
  TokenTransferTargetType,
  getValueFromReference,
} from '@summerfi/sdk-common/simulation'
import { Simulator } from '../../implementation/simulator-engine'
import { TokenAmount } from '@summerfi/sdk-common/common'
import { IRefinanceParameters } from '@summerfi/sdk-common/orders'
import { isLendingPool } from '@summerfi/sdk-common/protocols'
import { refinanceLendingToLendingSamePairStrategy } from './Strategy'
import { type IRefinanceDependencies } from '../common/Types'

export async function refinanceLendingToLendingSamePair(
  args: IRefinanceParameters,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  dependencies: IRefinanceDependencies,
): Promise<ISimulation<SimulationType.Refinance>> {
  // args validation
  if (!isLendingPool(args.sourcePosition.pool)) {
    throw new Error('Source pool is not a lending pool')
  }
  if (!isLendingPool(args.targetPool)) {
    throw new Error('Target pool is not a lending pool')
  }

  const position = args.sourcePosition
  const targetPool = args.targetPool

  if (!isLendingPool(targetPool)) {
    throw new Error('Target pool is not a lending pool')
  }

  const FLASHLOAN_MARGIN = 1.001
  const flashloanAmount = position.debtAmount.multiply(FLASHLOAN_MARGIN)
  const simulator = Simulator.create(refinanceLendingToLendingSamePairStrategy)

  // TODO: read debt amount from chain (special step: ReadDebtAmount)
  // TODO: the swap quote should also include the summer fee, in this case we need to know when we are taking the fee,
  // before or after the swap, it influences actual call to oneInch api
  const simulation = await simulator
    .next(async () => ({
      name: 'Flashloan',
      type: SimulationSteps.Flashloan,
      inputs: {
        amount: flashloanAmount,
        provider: FlashloanProvider.Balancer,
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
        withdrawTargetType: TokenTransferTargetType.PositionsManager,
        withdrawAmount: position.collateralAmount,
        position: position,
      },
    }))
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
        depositAmount: position.collateralAmount,
        borrowAmount: position.debtAmount, // TODO figure the debt amount
        position: getValueFromReference(ctx.getReference(['OpenTargetPosition', 'position'])),
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
        (p) => p.pool.id.protocol === targetPool.id.protocol,
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
    simulationType: SimulationType.Refinance,
    sourcePosition: position,
    targetPosition,
    swaps: Object.values(simulation.swaps),
    steps: Object.values(simulation.steps),
  } as ISimulation<SimulationType.Refinance>
}
