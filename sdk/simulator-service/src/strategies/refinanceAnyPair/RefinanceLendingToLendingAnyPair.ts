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
import { Position, TokenAmount, Percentage, Price, Token } from '@summerfi/sdk-common/common'
import { newEmptyPositionFromPool } from '@summerfi/sdk-common/common/utils'
import { IRefinanceParameters } from '@summerfi/sdk-common/orders'
import { isLendingPool } from '@summerfi/sdk-common/protocols'
import { refinanceLendingToLendingAnyPairStrategy } from './Strategy'
import { type IRefinanceDependencies } from '../common/Types'
import { getSwapStepData } from '../../implementation/utils/GetSwapStepData'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { isSameTokens } from '@summerfi/sdk-common'

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
        })
      }),
      isCollateralSwapSkipped,
    )
    .next(async (ctx) => ({
      name: 'DepositBorrowToTarget',
      type: SimulationSteps.DepositBorrow,
      inputs: {
        // refactor
        borrowAmount: await estimateTokenAmountAfterSwap({
          sourceAmount: position.debtAmount,
          targetToken: targetDebtConfig.token,
          slippage: Percentage.createFrom(args.slippage),
          swapManager: dependencies.swapManager,
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
        inputs: await getSwapStepData({
          chainInfo: position.pool.protocol.chainInfo,
          fromAmount: getValueFromReference(ctx.getReference(['DepositBorrowToTarget', 'borrowAmount'])),
          toToken: flashloanAmount.token,
          slippage: Percentage.createFrom({ value: args.slippage.value }),
          swapManager: dependencies.swapManager,
        })
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
 * EstimateTokenAmountAfterSwap
 * @description Estimates how much you will recive after swap.
 *    If target token is the same as source token, we return the same amount.
 *    When we perform a swap, we need to account for the summer fee,
 *    and we assume maximum slippage.
 */
async function estimateTokenAmountAfterSwap(params: {
  sourceAmount: TokenAmount
  targetToken: Token
  slippage: Percentage
  swapManager: ISwapManager
}): Promise<TokenAmount> {
  const { sourceAmount, slippage } = params
  
  if (isSameTokens(sourceAmount.token, params.targetToken)) {
    return sourceAmount
  }

  const spotPrice = (
    await params.swapManager.getSpotPrice({
      chainInfo: sourceAmount.token.chainInfo,
      baseToken: params.targetToken,
      quoteToken: sourceAmount.token,
    })
  ).price

  const summerFee = await params.swapManager.getSummerFee({
    from: { token: sourceAmount.token },
    to: { token: params.targetToken },
  })

  const summerFeeAmount = applyPercentage(sourceAmount, summerFee)
  const prevAmountAfterFee = sourceAmount.subtract(summerFeeAmount)
  const amountInTagetToken = prevAmountAfterFee.multiply(spotPrice)
  
  const amountAfterSlippage = subtractPercentage(
    amountInTagetToken,
    Percentage.createFrom({
      value: slippage.value,
    }),
  )
  return amountAfterSlippage
}
