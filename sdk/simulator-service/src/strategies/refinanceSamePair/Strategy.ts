import { SimulationSteps } from '@summerfi/sdk-common/simulation'
import { makeStrategy } from '../../implementation/utils'

export const refinanceLendingToLendingSamePairStrategy = makeStrategy([
  {
    step: SimulationSteps.Flashloan,
    optional: false,
  },
  {
    step: SimulationSteps.PaybackWithdraw,
    optional: false,
  },
  {
    step: SimulationSteps.DepositBorrow,
    optional: false,
  },
  {
    step: SimulationSteps.RepayFlashloan,
    optional: false,
  },
  {
    step: SimulationSteps.NewPositionEvent,
    optional: false,
  },
])
