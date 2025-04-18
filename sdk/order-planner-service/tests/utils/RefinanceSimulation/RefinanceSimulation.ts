import {
  ILendingPosition,
  IRefinanceSimulation,
  FlashloanProvider,
  RefinanceSimulation,
  SimulationSteps,
  TokenTransferTargetType,
  steps,
} from '@summerfi/sdk-common'

export function getRefinanceSimulation(params: {
  sourcePosition: ILendingPosition
  targetPosition: ILendingPosition
}): IRefinanceSimulation {
  const { sourcePosition, targetPosition } = params

  return RefinanceSimulation.createFrom({
    sourcePosition: sourcePosition,
    targetPosition: targetPosition,
    swaps: [],
    steps: [
      {
        name: 'Flashloan',
        type: SimulationSteps.Flashloan,
        inputs: {
          amount: sourcePosition.debtAmount,
          provider: FlashloanProvider.Balancer,
        },
        outputs: undefined,
      } as steps.FlashloanStep,
      {
        name: 'PaybackWithdraw',
        type: SimulationSteps.PaybackWithdraw,
        inputs: {
          paybackAmount: sourcePosition.debtAmount,
          position: sourcePosition,
          withdrawAmount: sourcePosition.collateralAmount,
        },
        outputs: {
          paybackAmount: sourcePosition.debtAmount,
          withdrawAmount: sourcePosition.collateralAmount,
        },
      } as steps.PaybackWithdrawStep,
      // TODO: skipping the first swap step for now
      {
        name: 'DepositBorrow',
        type: SimulationSteps.DepositBorrow,
        inputs: {
          depositAmount: targetPosition.collateralAmount,
          borrowAmount: targetPosition.debtAmount,
          position: targetPosition,
          borrowTargetType: TokenTransferTargetType.StrategyExecutor,
        },
        outputs: {
          depositAmount: targetPosition.collateralAmount,
          borrowAmount: targetPosition.debtAmount,
        },
      } as steps.DepositBorrowStep,
      // TODO: skipping the second swap step for now
      {
        name: 'RepayFlashloan',
        type: SimulationSteps.RepayFlashloan,
        inputs: {
          amount: sourcePosition.debtAmount,
        },
        outputs: undefined,
      } as steps.RepayFlashloanStep,
      {
        name: 'ReturnFunds',
        type: SimulationSteps.ReturnFunds,
        inputs: {
          token: sourcePosition.debtAmount.token,
        },
        outputs: undefined,
      } as steps.ReturnFundsStep,
    ],
  })
}
