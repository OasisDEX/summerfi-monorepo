import { applyPercentage, subtractPercentage } from '@summerfi/sdk-common/utils'
import {
  FlashloanProvider,
  ISimulation,
  SimulationSteps,
  SimulationType,
  TokenTransferTargetType,
  getValueFromReference,
} from '@summerfi/sdk-common/simulation'
import { Simulator } from '../../implementation/simulator-engine'
import { Position, TokenAmount, Percentage, Price } from '@summerfi/sdk-common/common'
import { newEmptyPositionFromPool } from '@summerfi/sdk-common/common/utils'
import { IRefinanceParameters } from '@summerfi/sdk-common/orders'
import { isLendingPool } from '@summerfi/sdk-common/protocols'
import { refinanceLendingToLendingAnyPairStrategy } from './Strategy'
import { type IRefinanceDependencies } from '../common/Types'
import { AddressType, Token } from '@summerfi/sdk-common'

// const token: TokenAmount = TokenAmount.createFrom({
//   amount: '100',
//   token: Token.createFrom({
//     name: 'DAI',
//     address: {
//       value: '0x6b175474e89094c44da98b954eedeac495271d0f',
//       type: AddressType.Ethereum,
//     },
//     decimals: 18,
//     symbol: 'DAI',
//     chainInfo: {
//       chainId: 1,
//       name: 'Ethereum',
//     },
//   }),
// })

// applyPercentage(token, Percentage.createFrom({ value: 0.1 }))

export async function refinanceLendingToLendingAnyPair(
  args: IRefinanceParameters,
  dependencies: IRefinanceDependencies,
): Promise<ISimulation<SimulationType.Refinance>> {
  // args validation
  if (!isLendingPool(args.targetPosition.pool)) {
    throw new Error('Target pool is not a lending pool')
  }

  const position = Position.createFrom(args.sourcePosition)
  const targetPool = await dependencies.protocolManager.getPool(args.targetPosition.pool.poolId)

  if (!isLendingPool(targetPool)) {
    throw new Error('Target pool is not a lending pool')
  }

  const FLASHLOAN_MARGIN = 1.001
  const flashloanAmount = position.debtAmount.multiply(FLASHLOAN_MARGIN)
  const simulator = Simulator.create(refinanceLendingToLendingAnyPairStrategy)

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
  const isDebtSwapSkipped = targetDebtConfig.token.address.equals(position.debtAmount.token.address)

  const debtSpotPrice = (
    await dependencies.swapManager.getSpotPrice({
      chainInfo: position.pool.protocol.chainInfo,
      baseToken: targetDebtConfig.token,
      quoteToken: position.debtAmount.token,
    })
  ).price

  const collateralSwapSummerFee = dependencies.swapManager.getSummerFee({
    from: { token: position.collateralAmount.token, protocol: position.pool.protocol },
    to: { token: targetCollateralConfig.token, protocol: targetPool.protocol },
  })
  const debtSwapSummerFee = dependencies.swapManager.getSummerFee({
    from: { token: position.debtAmount.token, protocol: position.pool.protocol },
    to: { token: targetDebtConfig.token, protocol: targetPool.protocol },
  })

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
    .next(
      async () => ({
        name: 'CollateralSwap',
        type: SimulationSteps.Swap,
        inputs: {
          ...(await dependencies.swapManager.getSwapQuoteExactInput({
            chainInfo: position.pool.protocol.chainInfo,
            fromAmount: subtractPercentage(
              position.collateralAmount,
              Percentage.createFrom({
                value: collateralSwapSummerFee.value,
              }),
            ),
            toToken: targetCollateralConfig.token,
          })),
          spotPrice: (
            await dependencies.swapManager.getSpotPrice({
              chainInfo: position.pool.protocol.chainInfo,
              baseToken: targetCollateralConfig.token,
              quoteToken: position.collateralAmount.token,
            })
          ).price,
          slippage: Percentage.createFrom({ value: args.slippage.value }),
          summerFee: collateralSwapSummerFee,
        },
      }),
      isCollateralSwapSkipped,
    )
    .next(async (ctx) => ({
      name: 'DepositBorrowToTarget',
      type: SimulationSteps.DepositBorrow,
      inputs: {
        borrowAmount: await calculateBorrowAmount({
          isDebtSwapSkipped,
          prevDebtAmount: position.debtAmount,
          debtSpotPrice,
          slippage: Percentage.createFrom(args.slippage),
          summerFee: debtSwapSummerFee,
        }),
        depositAmount: ctx.getReference(
          isCollateralSwapSkipped
            ? ['PaybackWithdrawFromSource', 'withdrawAmount']
            : ['CollateralSwap', 'receivedAmount'],
        ),
        position: newEmptyPositionFromPool(
          targetPool,
          targetDebtConfig.token,
          targetCollateralConfig.token,
        ),
        borrowTargetType: TokenTransferTargetType.PositionsManager,
      },
    }))
    .next(
      async (ctx) => ({
        name: 'DebtSwap',
        type: SimulationSteps.Swap,
        inputs: {
          ...(await dependencies.swapManager.getSwapQuoteExactInput({
            chainInfo: args.sourcePosition.pool.protocol.chainInfo,
            fromAmount: subtractPercentage(
              // TODO: this should have better semantics. There was a bug where `getReferencedValue` was used instead of `getValueFromReference`, the names are too similar
              getValueFromReference(ctx.getReference(['DepositBorrowToTarget', 'borrowAmount'])),
              Percentage.createFrom({
                value: debtSwapSummerFee.value,
              }),
            ),
            toToken: flashloanAmount.token,
          })),
          spotPrice: debtSpotPrice,
          slippage: Percentage.createFrom({ value: args.slippage.value }),
          summerFee: debtSwapSummerFee,
        },
      }),
      isDebtSwapSkipped,
    )
    .next(async () => ({
      name: 'RepayFlashloan',
      type: SimulationSteps.RepayFlashloan,
      inputs: {
        amount: flashloanAmount,
      },
    }))
    .next(
      async () => ({
        name: 'ReturnFunds',
        type: SimulationSteps.ReturnFunds,
        inputs: {
          /*
           * We swap back to the original position's debt in order to repay the flashloan.
           * Therefore, the dust amount will be in the original position's debt
           * */
          token: position.debtAmount.token,
        },
      }),
      isDebtSwapSkipped,
    )
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
    simulationType: SimulationType.Refinance,
    sourcePosition: position,
    targetPosition,
    swaps: Object.values(simulation.swaps),
    steps: Object.values(simulation.steps),
  } satisfies ISimulation<SimulationType.Refinance>
}

/**
 * CalculateBorrowAmount
 * @description Determines how much to borrow.
 *    When the DebtSwap step is skipped we simply return the previous position's debt amount
 *    When a DebtSwap is required we need to borrow enough to cover the original flashloan after
 *    accounting the swap and assuming the worst case scenario on slippage IE max slippage.
 *
 *    We also need to factor in Summer fees ahead of time
 */
function calculateBorrowAmount(params: {
  isDebtSwapSkipped: boolean
  prevDebtAmount: TokenAmount
  debtSpotPrice: Price
  slippage: Percentage
  summerFee: Percentage
}): TokenAmount {
  const { isDebtSwapSkipped, prevDebtAmount, debtSpotPrice, slippage, summerFee } = params

  /**
   * If no swap is required we simply borrow the same amount of debt, and the same asset,
   * on the target protocol
   */
  if (isDebtSwapSkipped) {
    return prevDebtAmount
  }

  /**
   * Worked Example
   * @description 3 ETH/ 5000 DAI -> X WTBC / Y USDC
   *    5000 DAI * (0.98 USDC/DAI) = 4900 USDC
   *    but this assumes zero price impact
   *
   *    5000 DAI * (0.98 USDC/DAI) / (1 - 0.01) = 4949.49 USDC (slippage adjusted borrow amount)
   *    where 0.01 is 1% slippage
   *
   *    (5000 DAI * (0.98 USDC/DAI) / (1 - 0.01)) / (1 - 0.002) = 4959.41 USDC (slippage + summer fee adjusted borrow amount)
   *    where 0.002 is 20 basis pt fee as an example
   *
   *    More generally we'd write this as
   *    (sourcePositionDebt * targetDebtQuotedInSourceDebtPrice / (one - slippage)) / (one - summer fee) = borrowAmount
   */
  const borrowAmount = prevDebtAmount.multiply(debtSpotPrice.value)
  const borrowAmountAdjustedForSlippage = subtractPercentage(
    borrowAmount,
    Percentage.createFrom({
      value: slippage.value,
    }),
  )
  const borrowAmountAdjustedForSlippageAndSummerFee = subtractPercentage(
    borrowAmountAdjustedForSlippage,
    Percentage.createFrom({
      value: summerFee.value,
    }),
  )

  return TokenAmount.createFrom({
    amount: borrowAmountAdjustedForSlippageAndSummerFee.amount,
    token: debtSpotPrice.baseToken,
  })
}
