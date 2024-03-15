import {
  FlashloanProvider,
  Simulation,
  SimulationSteps,
  SimulationType,
} from '@summerfi/sdk-common/simulation'
import { getReferencedValue, makeStrategy } from '~simulator-service/implementation/helpers'
import { Simulator } from '~simulator-service/implementation/simulator-engine'
import { Percentage, TokenAmount } from '@summerfi/sdk-common/common'
import { newEmptyPositionFromPool } from '@summerfi/sdk-common/common/utils'
import { RefinanceParameters } from '@summerfi/sdk-common/orders'
import { type ISwapManager } from '@summerfi/swap-common/interfaces'
import { isLendingPool } from '@summerfi/sdk-common/protocols'

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
    step: SimulationSteps.Swap,
    optional: true,
  },
  {
    step: SimulationSteps.DepositBorrow,
    optional: false,
  },
  {
    step: SimulationSteps.Swap,
    optional: true,
  },
  {
    step: SimulationSteps.RepayFlashloan,
    optional: false,
  },
  {
    // In case of target debt being different then source debt we need a swap,
    // We cannot forsee the exact amount of the swap, so we need to return excess tokens to user
    step: SimulationSteps.ReturnFunds,
    optional: true,
  },
])

// TODO move those interfaces to more appropriate place

export interface RefinanceDependencies {
  swapManager: ISwapManager
  getSummerFee: () => Percentage
}

export async function refinaceLendingToLending(
  args: RefinanceParameters,
  dependencies: RefinanceDependencies,
): Promise<Simulation<SimulationType.Refinance>> {
  // args validation
  if (!isLendingPool(args.targetPool)) {
    throw new Error('Target pool is not a lending pool')
  }

  const FLASHLOAN_MARGIN = 0.001
  const flashloanAmount = args.position.debtAmount.multiply(FLASHLOAN_MARGIN)
  const simulator = Simulator.create(refinanceStrategy)

  const isCollateralSwapSkipped =
    args.position.collateralAmount.token.address === args.targetPool.collaterals[args.position.collateralAmount.token.address.value].token.address
  const isDebtSwapSkipped =
    args.position.debtAmount.token.address !== args.targetPool.debts[args.position.debtAmount.token.address.value].token.address
  // let debtSwapQuote: Quote | undefined
  // TODO: implement case with swaps
  // if (!isDebtSwapSkipped) {
  //     debtSwapQuote = await dependencies.getQuote({
  //         from: args.targetPool.debtTokens[0],
  //         to: args.position.debtAmount.token,
  //         slippage: args.slippage,
  //         fee: 0,
  //     })
  // }

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
      name: 'PaybackWithdraw',
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
          toToken: args.targetPool.collaterals[args.position.collateralAmount.token.address.value].token
        })),
      // inputs: await dependencies.getQuote({
      //   from: args.position.collateralAmount,
      //   to: args.targetPool.collaterals[args.position.collateralAmount.token.address.value].token,
        slippage: args.slippage,
        fee: dependencies.getSummerFee(),
      },
      skip: isCollateralSwapSkipped,
    }))
    .next(async (ctx) => ({
      name: 'DepositBorrow',
      type: SimulationSteps.DepositBorrow,
      inputs: {
        depositAmount: ctx.getReference(
          isCollateralSwapSkipped
            ? ['PaybackWithdraw', 'withdrawAmount']
            : ['CollateralSwap', 'receivedAmount'],
        ),
        borrowAmount: args.position.debtAmount, // TODO figure the debt amount
        position: newEmptyPositionFromPool(args.targetPool, args.position.debtAmount.token.address.value, args.position.collateralAmount.token.address.value),
      },
    }))
    .next(async (ctx) => ({
      name: 'DebtSwap',
      type: SimulationSteps.Swap,
      // inputs: await dependencies.getQuote({
      //   from: getReferencedValue(ctx.getReference(['DepositBorrow', 'borrowAmount'])),
      //   to: args.targetPool.collaterals[args.position.collateralAmount.token.address.value].token,
      inputs: {
        ...(await dependencies.swapManager.getSwapQuoteExactInput({
          chainInfo: args.position.pool.protocol.chainInfo,
          fromAmount: getReferencedValue(ctx.getReference(['DepositBorrow', 'borrowAmount'])),
          toToken: args.targetPool.debts[args.position.debtAmount.token.address.value].token,
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
        token: args.targetPool.collaterals[args.position.collateralAmount.token.address.value].token,
      },
      skip: isDebtSwapSkipped,
    }))
    .run()

  // TODO: I think simulation should return the simulation position as a preperty targetPosition for easy discoverability
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
    steps: Object.values(simulation.steps),
  }
}
