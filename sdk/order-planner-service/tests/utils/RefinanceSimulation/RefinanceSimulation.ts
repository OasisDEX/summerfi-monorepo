import {
  FlashloanProvider,
  Simulation,
  SimulationSteps,
  SimulationType,
  steps,
} from '@summerfi/sdk-common/simulation'
import { Position } from '@summerfi/sdk-common/common'

export function getRefinanceSimulation(params: {
  sourcePosition: Position
  targetPosition: Position
}): Simulation<SimulationType.Refinance> {
  const { sourcePosition, targetPosition } = params

  return {
    simulationType: SimulationType.Refinance,
    sourcePosition: sourcePosition,
    targetPosition: targetPosition,
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
      } as steps.RepayFlashloan,
      {
        name: 'ReturnFunds',
        type: SimulationSteps.ReturnFunds,
        inputs: {
          token: sourcePosition.debtAmount.token,
        },
        outputs: undefined,
      } as steps.ReturnFunds,
    ],
  }
}
