import {
  ISimulation,
  SimulationSteps,
  SimulationType,
  TokenTransferTargetType,
} from '@summerfi/sdk-common/simulation'
import { Simulator } from '../../implementation/simulator-engine'
import { Percentage, Position, TokenAmount } from '@summerfi/sdk-common/common'
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
  if (!isLendingPool(args.targetPosition.pool)) {
    throw new Error('Target pool is not a lending pool')
  }

  const position = Position.createFrom(args.sourcePosition)
  const targetPool = await dependencies.protocolManager.getPool(args.targetPosition.pool.poolId)

  if (!isLendingPool(targetPool)) {
    throw new Error('Target pool is not a lending pool')
  }
  const simulator = Simulator.create(refinanceLendingToLendingNoDebtStrategy)

  const targetTokenConfig = targetPool.collaterals.get({ token: position.collateralAmount.token })
  if (!targetTokenConfig) {
    throw new Error('Target token not found in pool')
  }

  const zeroAmount = TokenAmount.createFromBaseUnit({
    token: position.debtAmount.token,
    amount: '0',
  })

  const targetCollateralConfig = targetPool.collaterals.get({
    token: args.targetPosition.collateralAmount.token,
  })
  const targetDebtConfig = targetPool.debts.get({ token: args.targetPosition.debtAmount.token })

  if (!targetCollateralConfig || !targetDebtConfig) {
    throw new Error('Target token config not found in pool')
  }

  const isCollateralSwapSkipped = targetCollateralConfig.token.address.equals(
    position.collateralAmount.token.address,
  )

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
          chainInfo: position.pool.protocol.chainInfo,
          fromAmount: position.collateralAmount,
          toToken: targetCollateralConfig.token,
          slippage: Percentage.createFrom({ value: args.slippage.value }),
          swapManager: dependencies.swapManager,
        }),
      }),
      isCollateralSwapSkipped,
    )
    .next(async (ctx) => ({
      name: 'DepositBorrowToTarget',
      type: SimulationSteps.DepositBorrow,
      inputs: {
        depositAmount: ctx.getReference(
          isCollateralSwapSkipped
            ? ['PaybackWithdrawFromSource', 'withdrawAmount']
            : ['CollateralSwap', 'received'],
        ),
        borrowAmount: TokenAmount.createFrom({
          amount: '0',
          token: position.debtAmount.token,
        }),
        position: newEmptyPositionFromPool(
          targetPool,
          targetDebtConfig.token,
          targetCollateralConfig.token,
        ),
        borrowTargetType: TokenTransferTargetType.PositionsManager,
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
    simulationType: isCollateralSwapSkipped
      ? SimulationType.RefinanceNoDebt
      : SimulationType.RefinanceNoDebtDifferentCollateral,
    sourcePosition: position,
    targetPosition,
    swaps: Object.values(simulation.swaps),
    steps: Object.values(simulation.steps),
  }
}
