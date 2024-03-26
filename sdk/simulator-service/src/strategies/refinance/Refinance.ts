import {
  FlashloanProvider,
  ISimulation,
  SimulationSteps,
  SimulationType,
} from '@summerfi/sdk-common/simulation'
import { getReferencedValue } from '../../implementation/utils'
import { Simulator } from '../../implementation/simulator-engine'
import { TokenAmount } from '@summerfi/sdk-common/common'
import { newEmptyPositionFromPool } from '@summerfi/sdk-common/common/utils'
import { RefinanceParameters } from '@summerfi/sdk-common/orders'
import { isLendingPool } from '@summerfi/sdk-common/protocols'
import { refinanceLendingToLendingStrategy } from './Strategy'
import { RefinanceDependencies } from './Types'

export async function refinance(
  args: RefinanceParameters,
  dependencies: RefinanceDependencies,
): Promise<ISimulation<SimulationType.Refinance>> {
  // args validation
  if (!isLendingPool(args.targetPool)) {
    throw new Error('Target pool is not a lending pool')
  }

  const FLASHLOAN_MARGIN = 0.001
  const flashloanAmount = args.position.debtAmount.multiply(FLASHLOAN_MARGIN)
  const simulator = Simulator.create(refinanceLendingToLendingStrategy)

  const isCollateralSwapSkipped = args.position.collateralAmount.token.address.equals(
    args.targetCollateral,
  )
  const isDebtSwapSkipped = args.position.debtAmount.token.address.equals(args.targetDebt)

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
          token: args.position.debtAmount.token,
        }),
        withdrawAmount: TokenAmount.createFrom({
          amount: Number.MAX_SAFE_INTEGER.toString(),
          token: args.position.collateralAmount.token,
        }),
        position: args.position,
      },
    }))
    .next(async () => ({
      name: 'CollateralSwap',
      type: SimulationSteps.Swap,
      inputs: {
        ...(await dependencies.swapManager.getSwapQuoteExactInput({
          chainInfo: args.position.pool.protocol.chainInfo,
          fromAmount: args.position.collateralAmount,
          toToken: args.targetPool.collaterals[args.targetCollateral.value].token,
        })),
        slippage: args.slippage,
        fee: dependencies.getSummerFee(),
      },
      skip: isCollateralSwapSkipped,
    }))
    .next(async (ctx) => ({
      name: 'DepositBorrowToTarget',
      type: SimulationSteps.DepositBorrow,
      inputs: {
        depositAmount: ctx.getReference(
          isCollateralSwapSkipped
            ? ['PaybackWithdrawFromSource', 'withdrawAmount']
            : ['CollateralSwap', 'receivedAmount'],
        ),
        borrowAmount: args.position.debtAmount, // TODO: figure the debt amount after Swap
        position: newEmptyPositionFromPool(
          args.targetPool,
          args.targetDebt.value,
          args.targetCollateral.value,
        ),
      },
    }))
    .next(async (ctx) => ({
      name: 'DebtSwap',
      type: SimulationSteps.Swap,
      inputs: {
        ...(await dependencies.swapManager.getSwapQuoteExactInput({
          chainInfo: args.position.pool.protocol.chainInfo,
          fromAmount: getReferencedValue(
            ctx.getReference(['DepositBorrowToTarget', 'borrowAmount']),
          ),
          toToken: args.targetPool.debts[args.targetDebt.value].token,
        })),
        slippage: args.slippage,
        fee: dependencies.getSummerFee(),
      },
      skip: isDebtSwapSkipped,
    }))
    .next(async () => ({
      name: 'RepayFlashloan',
      type: SimulationSteps.RepayFlashloan,
      inputs: {
        amount: args.position.debtAmount, // TODO add some amount
      },
    }))
    .next(async () => ({
      name: 'ReturnFunds',
      type: SimulationSteps.ReturnFunds,
      inputs: {
        token:
          args.targetPool.collaterals[args.position.collateralAmount.token.address.value].token,
      },
      skip: isDebtSwapSkipped,
    }))
    .run()

  const targetPosition = Object.values(simulation.positions).find(
    (p) => p.pool.protocol === args.targetPool.protocol,
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
  }
}
