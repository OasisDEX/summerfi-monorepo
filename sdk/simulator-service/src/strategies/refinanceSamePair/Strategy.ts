import { SimulationSteps } from '@summerfi/sdk-common/simulation'
import { makeStrategy } from '../../implementation/utils'

export const refinanceLendingToLendingSamePairStrategy = makeStrategy([
  {
    name: 'Flashloan',
    step: SimulationSteps.Flashloan,
    optional: false,
  },
  {
    name: 'PaybackWithdrawFromSourcePosition',
    step: SimulationSteps.PaybackWithdraw,
    optional: false,
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
    name: 'RepayFlashloan',
    step: SimulationSteps.RepayFlashloan,
    optional: false,
  },
  {
    name: 'NewPositionEvent',
    step: SimulationSteps.NewPositionEvent,
    optional: false,
  },
] as const)
