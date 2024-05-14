import {
  ISimulation,
  SimulationSteps,
  SimulationType,
  TokenTransferTargetType,
} from '@summerfi/sdk-common/simulation'
import { Simulator } from '../../implementation/simulator-engine'
import { Percentage, TokenAmount } from '@summerfi/sdk-common/common'
import { newEmptyPositionFromPool } from '@summerfi/sdk-common/common/utils'
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
  if (!isLendingPool(args.targetPosition.pool)) {
    throw new Error('Target pool is not a lending pool')
  }

  const position = args.sourcePosition
  const sourcePool = args.sourcePosition.pool
  const targetPool = args.targetPosition.pool

  if (!isLendingPool(targetPool)) {
    throw new Error('Target pool is not a lending pool')
  }
  const simulator = Simulator.create(refinanceLendingToLendingNoDebtStrategy)

  const zeroAmount = TokenAmount.createFromBaseUnit({
    token: position.debtAmount.token,
    amount: '0',
  })

  const isCollateralSwapSkipped = !targetPool.collateralToken.equals(sourcePool.collateralToken)

  const simulation = await simulator
    .next(async () => ({
      name: 'PaybackWithdrawFromSource',
      type: SimulationSteps.PaybackWithdraw,
      inputs: {
        paybackAmount: zeroAmount,
        withdrawAmount: position.collateralAmount,
        position: position,
      },
    }))
    .next(
      async () => ({
        name: 'CollateralSwap',
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
    .next(async (ctx) => ({
      name: 'DepositBorrowToTarget',
      type: SimulationSteps.DepositBorrow,
      inputs: {
        depositAmount: isCollateralSwapSkipped
          ? position.collateralAmount
          : ctx.getReference(['CollateralSwap', 'received']),
        borrowAmount: TokenAmount.createFrom({
          amount: '0',
          token: targetPool.debtToken,
        }),
        position: newEmptyPositionFromPool(targetPool),
        borrowTargetType: TokenTransferTargetType.PositionsManager,
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

  const targetPosition = Object.values(simulation.positions).find((p) =>
    p.pool.id.protocol.equals(targetPool.id.protocol),
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
