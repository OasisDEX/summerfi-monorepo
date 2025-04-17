import { SimulationSteps } from '@summerfi/sdk-common'
import { makeStrategy } from '../../implementation/utils'

export const refinanceLendingToLendingAnyPairStrategy = makeStrategy([
  {
    name: 'Flashloan',
    step: SimulationSteps.Flashloan,
    optional: true,
  },
  {
    name: 'PaybackWithdrawFromSourcePosition',
    step: SimulationSteps.PaybackWithdraw,
    optional: false,
  },
  {
    name: 'SwapCollateralFromSourcePosition',
    step: SimulationSteps.Swap,
    optional: true,
  },
  {
    name: 'OpenTargetPosition',
    step: SimulationSteps.OpenPosition,
    optional: false,
  },
  {
    name: 'DepositBorrowToTargetPosition',
    step: SimulationSteps.DepositBorrow,
    optional: false,
  },
  {
    name: 'SwapDebtFromTargetPosition',
    step: SimulationSteps.Swap,
    optional: true,
  },
  {
    name: 'RepayFlashloan',
    step: SimulationSteps.RepayFlashloan,
    optional: true,
  },
  {
    name: 'ReturnFunds',
    step: SimulationSteps.ReturnFunds,
    optional: true,
  },
  {
    name: 'NewPositionEvent',
    step: SimulationSteps.NewPositionEvent,
    optional: false,
  },
] as const)
