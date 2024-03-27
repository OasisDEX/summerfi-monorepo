import {
  FlashloanProvider,
  ISimulation,
  SimulationSteps,
  SimulationType,
  TokenTransferTargetType,
} from '@summerfi/sdk-common/simulation'
import { Simulator } from '../../implementation/simulator-engine'
import { Position, TokenAmount, Percentage } from '@summerfi/sdk-common/common'
import { newEmptyPositionFromPool } from '@summerfi/sdk-common/common/utils'
import { IRefinanceParameters } from '@summerfi/sdk-common/orders'
import { isLendingPool } from '@summerfi/sdk-common/protocols'
import { getReferencedValue } from '../../implementation/utils'
import { refinanceLendingToLendingStrategy } from './Strategy'
import { type IRefinanceDependencies } from './Types'

export async function refinanceLendingToLending(
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

  const FLASHLOAN_MARGIN = 0.001
  const flashloanAmount = position.debtAmount.multiply(FLASHLOAN_MARGIN)
  const simulator = Simulator.create(refinanceLendingToLendingStrategy)

  const targetCollateralConfig = targetPool.collaterals.get({ token: args.targetCollateral })
  const targetDebtConfig = targetPool.debts.get({ token: args.targetDebt })
  if (!targetCollateralConfig || !targetDebtConfig) {
    throw new Error('Target token config not found in pool')
  }

  const isCollateralSwapSkipped = targetCollateralConfig.token.address.equals(position.collateralAmount.token.address)
  const isDebtSwapSkipped = targetDebtConfig.token.address.equals(position.debtAmount.token.address)

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
        withdrawAmount: TokenAmount.createFrom({
          amount: Number.MAX_SAFE_INTEGER.toString(),
          token: position.collateralAmount.token,
        }),
        position: position,
      },
    }))
    .next(async () => ({
      name: 'CollateralSwap',
      type: SimulationSteps.Swap,
      inputs: {
        ...(await dependencies.swapManager.getSwapQuoteExactInput({
          chainInfo: position.pool.protocol.chainInfo,
          // TODO: Properly implement swaps
          fromAmount: position.collateralAmount,
          toToken: targetCollateralConfig.token,
        })),
        ...(await dependencies.swapManager.getSpotPrices({
          chainInfo: position.pool.protocol.chainInfo,
          tokens: [position.collateralAmount.token, targetCollateralConfig.token],
        })),
        slippage: Percentage.createFrom({ value: args.slippage.value }),
        fee: dependencies.getSummerFee(),
      },
      skip: isCollateralSwapSkipped,
    }))
    .next(async (ctx) => ({
      name: 'DepositBorrowToTarget',
      type: SimulationSteps.DepositBorrow,
      inputs: {
        borrowAmount: position.debtAmount, // TODO figure the debt amount
        depositAmount: ctx.getReference(
          isCollateralSwapSkipped
            ? ['PaybackWithdrawFromSource', 'withdrawAmount']
            : ['CollateralSwap', 'receivedAmount'],
        ),
        position: newEmptyPositionFromPool(
          targetPool,
          position.debtAmount.token,
          position.collateralAmount.token,
        ),
        borrowTargetType: TokenTransferTargetType.PositionsManager,
      },
    }))
    // TODO: Implement swapping logic properly. Current implementation is just placeholder
    .next(async (ctx) => ({
      name: 'DebtSwap',
      type: SimulationSteps.Swap,
      inputs: {
        ...(await dependencies.swapManager.getSwapQuoteExactInput({
          chainInfo: args.position.pool.protocol.chainInfo,
          fromAmount: getReferencedValue(
            ctx.getReference(['DepositBorrowToTarget', 'borrowAmount']),
          ),
          toToken: targetDebtConfig.token,
        })),
        ...(await dependencies.swapManager.getSpotPrices({
          chainInfo: args.position.pool.protocol.chainInfo,
          tokens: [position.debtAmount.token, targetDebtConfig.token],
        })),
        slippage: Percentage.createFrom({ value: args.slippage.value }),
        fee: dependencies.getSummerFee(),
      },
      skip: isDebtSwapSkipped,
    }))
    .next(async () => ({
      name: 'RepayFlashloan',
      type: SimulationSteps.RepayFlashloan,
      inputs: {
        amount: position.debtAmount, // TODO add some amount
      },
    }))
    .run()

  const targetPosition = Object.values(simulation.positions).find(
    (p) => p.pool.protocol === targetPool.protocol,
  )

  if (!targetPosition) {
    throw new Error('Target position not found')
  }

  return {
    simulationType: SimulationType.Refinance,
    sourcePosition: args.position,
    targetPosition,
    swaps: Object.values(simulation.swaps),
    steps: Object.values(simulation.steps),
  } satisfies ISimulation<SimulationType.Refinance>
}
