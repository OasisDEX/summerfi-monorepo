import { FlashloanProvider, Simulation, SimulationSteps } from '@summerfi/sdk-common/simulation'
import { getReferencedValue, makeStrategy } from '~swap-service/implementation/helpers'
import { LendingPool } from '@summerfi/sdk-common/protocols'
import { Simulator } from '~swap-service/implementation/simulator-engine'
import { Token, TokenAmount, Position } from '@summerfi/sdk-common/common/implementation'
import { SimulationType } from '@summerfi/sdk-common/orders'
import { newEmptyPositionFromPool } from '@summerfi/sdk-common/common/utils'

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
    step: SimulationSteps.PaybackFlashloan,
    optional: false,
  },
  {
    // In case of target debt being different then source debt we need a swap,
    // We cannot forsee the exact amount of the swap, so we need to return excess tokens to user
    step: SimulationSteps.ReturnFunds,
    optional: true,
  },
])

interface Quote {
  fromTokenAmount: TokenAmount
  toTokenAmount: TokenAmount
  slippage: number
  fee: number
}

interface GetQuote {
  (args: { from: TokenAmount; to: Token; slippage: number; fee: number }): Promise<Quote>
}

export interface RefinanceParameters {
  position: Position
  targetPool: LendingPool
  slippage: number
}

export interface RefinanceDependencies {
  getQuote: GetQuote
}

// function estimateFromAmount(
//     getQuote: GetQuote,
//     fromToken: Token,
//     to: Token,
//     slippage: number,
//     fee: number
// ): Promise<TokenAmount> {
//     return getQuote({
//         from: to,
//         to: from.token,
//         slippage,
//         fee
//     }).then(quote => quote.fromTokenAmount)
// }

export async function refinace(
  args: RefinanceParameters,
  dependecies: RefinanceDependencies,
): Promise<Simulation<SimulationType.Refinance>> {
  const FLASHLOAN_MARGIN = 0.001
  const flashloanAmount = args.position.debtAmount.multiply(FLASHLOAN_MARGIN)
  const simulator = Simulator.create(refinanceStrategy)

  const isCollateralSwapSkipped =
    args.position.collateralAmount.token.address === args.targetPool.collateralTokens[0].address
  const isDebtSwapSkipped =
    args.position.debtAmount.token.address !== args.targetPool.debtTokens[0].address
  let debtSwapQuote: Quote | undefined
  if (!isDebtSwapSkipped) {
    debtSwapQuote = await dependecies.getQuote({
      from: args.targetPool.debtTokens[0],
      to: args.position.debtAmount,
      slippage: args.slippage,
      fee: 0,
    })
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
      name: 'PaybackWithdraw',
      type: SimulationSteps.PaybackWithdraw,
      inputs: {
        paybackAmount: TokenAmount.createFrom({
          amount: Number.MAX_SAFE_INTEGER.toString(),
          token: args.position.pool.debtToken,
        }),
        withdrawAmount: TokenAmount.createFrom({
          amount: Number.MAX_SAFE_INTEGER.toString(),
          token: args.position.pool.collateralToken,
        }),
        position: args.position,
      },
    }))
    .next(async () => ({
      name: 'CollateralSwap',
      type: SimulationSteps.Swap,
      inputs: await dependecies.getQuote({
        from: args.position.collateralAmount,
        to: args.targetPool.collateralTokens[0],
        slippage: args.slippage,
        fee: 0,
      }),
      skip: isCollateralSwapSkipped,
    }))
    .next(async (ctx) => ({
      name: 'DepositBorrow',
      type: SimulationSteps.DepositBorrow,
      inputs: {
        depositAmount: ctx.getReference(
          isCollateralSwapSkipped
            ? ['PaybackWithdraw', 'withdrawAmount']
            : ['CollateralSwap', 'recievedAmount'],
        ),
        borrowAmount: args.position.debtAmount, // TODO figure the debt amount
        position: newEmptyPositionFromPool(args.targetPool),
      },
    }))
    .next(async (ctx) => ({
      name: 'DebtSwap',
      type: SimulationSteps.Swap,
      inputs: await dependecies.getQuote({
        from: getReferencedValue(ctx.getReference(['DepositBorrow', 'borrowAmount'])),
        to: args.targetPool.collateralTokens[0],
        slippage: args.slippage,
        fee: 0,
      }),
      skip: isDebtSwapSkipped,
    }))
    .next(async () => ({
      name: 'PaybackFlashloan',
      type: SimulationSteps.PaybackFlashloan,
      inputs: {
        amount: args.position.debtAmount, // TODO add some amount
      },
    }))
    .next(async () => ({
      name: 'ReturnFunds',
      type: SimulationSteps.ReturnFunds,
      inputs: {
        token: args.targetPool.collateralTokens[0],
      },
      skip: isDebtSwapSkipped,
    }))
    .run()

  return {
    simulationType: SimulationType.Refinance,
    sourcePosition: args.position,
    targetPosition: Object.values(simulation.positions).find(
      (p) => p.pool.protocolId.id === args.targetPool.protocolId.id,
    ),
    steps: Object.values(simulation.steps),
  }
}
