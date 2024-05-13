import { SimulationSteps } from '@summerfi/sdk-common/simulation'
import { makeStrategy } from '../../implementation/utils'

export const refinanceLendingToLendingNoDebtStrategy = makeStrategy([
  {
    name: "PaybackWithdrawFromSourcePosition",
    step: SimulationSteps.PaybackWithdraw,
    optional: false,
  },
  {
    name: "SwapCollateralFromSourcePosition",
    step: SimulationSteps.Swap,
    optional: true,
  },
  {
    name: "OpenTargetPosition",
    step: SimulationSteps.OpenPosition,
    optional: false,
  },
  {
    name: "DepositBorrowToTargetPosition",
    step: SimulationSteps.DepositBorrow,
    optional: false,
  },
  {
    name: "NewPositionEvent",
    step: SimulationSteps.NewPositionEvent,
    optional: false,
  },
] as const)