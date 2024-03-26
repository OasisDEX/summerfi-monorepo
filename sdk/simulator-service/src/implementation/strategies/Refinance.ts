import {
  FlashloanProvider,
  Simulation,
  SimulationSteps,
  SimulationType,
  TokenTransferTargetType,
} from '@summerfi/sdk-common/simulation'
import { makeStrategy } from '../helpers'
import { Simulator } from '../simulator-engine'
import { Percentage, Position, TokenAmount } from '@summerfi/sdk-common/common'
import { newEmptyPositionFromPool } from '@summerfi/sdk-common/common/utils'
import { IRefinanceParameters } from '@summerfi/sdk-common/orders'
import { type ISwapManager } from '@summerfi/swap-common/interfaces'
import { isLendingPool } from '@summerfi/sdk-common/protocols'
import { type IProtocolManager } from '@summerfi/protocol-manager-common'

export const refinanceStrategy = makeStrategy([
  {
    step: SimulationSteps.Flashloan,
    optional: false,
  },
  {
    step: SimulationSteps.PaybackWithdraw,
    optional: false,
  },
  {
    step: SimulationSteps.DepositBorrow,
    optional: false,
  },
  {
    step: SimulationSteps.RepayFlashloan,
    optional: false,
  },
])

// TODO move those interfaces to more appropriate place

export interface RefinanceDependencies {
  swapManager: ISwapManager
  protocolManager: IProtocolManager
  getSummerFee: () => Percentage
}

export async function refinaceLendingToLending(
  args: IRefinanceParameters,
  dependencies: RefinanceDependencies,
): Promise<Simulation<SimulationType.Refinance>> {
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
  const simulator = Simulator.create(refinanceStrategy)

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
    .run()

  // TODO: I think simulation should return the simulation position as a preperty targetPosition for easy discoverability
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
    steps: Object.values(simulation.steps),
  } as Simulation<SimulationType.Refinance>
}
