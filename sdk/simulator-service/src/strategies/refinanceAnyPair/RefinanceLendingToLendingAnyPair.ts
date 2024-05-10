import {
  FlashloanProvider,
  ISimulation,
  RefinanceSimulationTypes,
  SimulationSteps,
  SimulationType,
  TokenTransferTargetType,
  getValueFromReference,
} from '@summerfi/sdk-common/simulation'
import { Simulator } from '../../implementation/simulator-engine'
import {
  Position,
  TokenAmount,
  Percentage,
  IToken,
  ITokenAmount,
  IPercentage,
} from '@summerfi/sdk-common/common'
import { newEmptyPositionFromPool } from '@summerfi/sdk-common/common/utils'
import { IRefinanceParameters } from '@summerfi/sdk-common/orders'
import { isLendingPool } from '@summerfi/sdk-common/protocols'
import { refinanceLendingToLendingAnyPairStrategy } from './Strategy'
import { type IRefinanceDependencies } from '../common/Types'
import { getSwapStepData } from '../../implementation/utils/GetSwapStepData'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { BigNumber } from 'bignumber.js'
import { IOracleManager } from '@summerfi/oracle-common'

export async function refinanceLendingToLendingAnyPair(
  args: IRefinanceParameters,
  dependencies: IRefinanceDependencies,
): Promise<ISimulation<RefinanceSimulationTypes>> {
  // args validation
  if (!isLendingPool(args.targetPosition.pool)) {
    throw new Error('Target pool is not a lending pool')
  }

  const position = args.sourcePosition as Position
  const sourcePool = await dependencies.protocolManager.getLendingPool(args.sourcePosition.pool.id)
  const targetPool = await dependencies.protocolManager.getLendingPool(args.targetPosition.pool.id)

  if (!isLendingPool(sourcePool)) {
    throw new Error('Source pool is not a lending pool')
  }

  if (!isLendingPool(targetPool)) {
    throw new Error('Target pool is not a lending pool')
  }

  const FLASHLOAN_MARGIN = 1.001
  const flashloanAmount = position.debtAmount.multiply(FLASHLOAN_MARGIN)
  const simulator = Simulator.create(refinanceLendingToLendingAnyPairStrategy)

  const isCollateralSwapSkipped = !targetPool.id.collateralToken.equals(
    sourcePool.id.collateralToken,
  )
  const isDebtSwapSkipped = !targetPool.id.debtToken.equals(sourcePool.id.debtToken)

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
          chainInfo: position.pool.id.protocol.chainInfo,
          fromAmount: position.collateralAmount,
          toToken: targetPool.id.collateralToken,
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
        // refactor
        borrowAmount: isDebtSwapSkipped
          ? ctx.getReference(['PaybackWithdrawFromSource', 'paybackAmount'])
          : await estimateSwapFromAmount({
              receiveAtLeast: flashloanAmount,
              fromToken: targetPool.id.debtToken,
              slippage: Percentage.createFrom(args.slippage),
              swapManager: dependencies.swapManager,
              oracleManager: dependencies.oracleManager,
            }),
        depositAmount: isCollateralSwapSkipped
          ? position.collateralAmount
          : ctx.getReference(['CollateralSwap', 'received']),
        position: newEmptyPositionFromPool(targetPool),
        borrowTargetType: TokenTransferTargetType.PositionsManager,
      },
    }))
    .next(
      async (ctx) => ({
        name: 'DebtSwap',
        type: SimulationSteps.Swap,
        inputs: await getSwapStepData({
          chainInfo: position.pool.id.protocol.chainInfo,
          fromAmount: getValueFromReference(
            ctx.getReference(['DepositBorrowToTarget', 'borrowAmount']),
          ),
          toToken: flashloanAmount.token,
          slippage: Percentage.createFrom({ value: args.slippage.value }),
          swapManager: dependencies.swapManager,
          oracleManager: dependencies.oracleManager,
        }),
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
    .next(async () => ({
      name: 'ReturnFunds',
      type: SimulationSteps.ReturnFunds,
      inputs: {
        /*
         * We swap back to the original position's debt in order to repay the flashloan.
         * Therefore, the dust amount will be in the original position's debt
         * */
        token: position.debtAmount.token,
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
    simulationType: getSimulationType(!isCollateralSwapSkipped, !isDebtSwapSkipped),
    sourcePosition: position,
    targetPosition,
    swaps: Object.values(simulation.swaps),
    steps: Object.values(simulation.steps),
  } satisfies ISimulation<RefinanceSimulationTypes>
}

function getSimulationType(
  hasCollateralSwap: boolean,
  hasDebtSwap: boolean,
): RefinanceSimulationTypes {
  if (hasCollateralSwap && hasDebtSwap) {
    return SimulationType.RefinanceDifferentPair
  }

  if (hasCollateralSwap) {
    return SimulationType.RefinanceDifferentCollateral
  }

  if (hasDebtSwap) {
    return SimulationType.RefinanceDifferentDebt
  }

  return SimulationType.Refinance
}

/**
 * EstimateTokenAmountAfterSwap
 * @description Estimates how much you will recive after swap.
 *    If target token is the same as source token, we return the same amount.
 *    When we perform a swap, we need to account for the summer fee,
 *    and we assume maximum slippage.
 */
async function estimateSwapFromAmount(params: {
  receiveAtLeast: ITokenAmount
  fromToken: IToken
  slippage: IPercentage
  swapManager: ISwapManager
  oracleManager: IOracleManager
}): Promise<ITokenAmount> {
  const { receiveAtLeast, slippage } = params

  if (receiveAtLeast.token.equals(params.fromToken)) {
    return receiveAtLeast
  }

  const spotPrice = (
    await params.oracleManager.getSpotPrice({
      baseToken: receiveAtLeast.token,
      quoteToken: params.fromToken,
    })
  ).price

  const summerFee = await params.swapManager.getSummerFee({
    from: { token: receiveAtLeast.token },
    to: { token: params.fromToken },
  })

  const ONE = new BigNumber(1)
  /*
  TargetAmt = SourceAmt * (1 - SummerFee) / (SpotPrice * (1 + Slippage))
  SourceAmt = TargetAmt * SpotPrice * (1 + Slippage) / (1 - SummerFee) 
  */

  const sourceAmount = receiveAtLeast
    .toBN()
    .multipliedBy(spotPrice.toBN().times(ONE.plus(slippage.toProportion())))
    .div(ONE.minus(summerFee.toProportion()))

  return TokenAmount.createFrom({
    amount: sourceAmount.toString(),
    token: params.fromToken,
  })
}
