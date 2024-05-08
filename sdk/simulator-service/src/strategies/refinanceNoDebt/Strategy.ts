import { SimulationSteps } from '@summerfi/sdk-common/simulation'
import { makeStrategy } from '../../implementation/utils'

export const refinanceLendingToLendingNoDebtStrategy = makeStrategy([
  {
    step: SimulationSteps.PaybackWithdraw,
    optional: false,
  },
  {
    step: SimulationSteps.Swap,
    optional: true,
  },
  {
    step: SimulationSteps.OpenPosition,
    optional: false,
  },
  {
    step: SimulationSteps.DepositBorrow,
    optional: false,
  },
  {
    step: SimulationSteps.NewPositionEvent,
    optional: false,
  },
])
