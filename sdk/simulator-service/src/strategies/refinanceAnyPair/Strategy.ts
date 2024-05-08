import { SimulationSteps } from '@summerfi/sdk-common/simulation'
import { makeStrategy } from '../../implementation/utils'

export const refinanceLendingToLendingAnyPairStrategy = makeStrategy([
  {
    step: SimulationSteps.Flashloan,
    optional: false,
  },
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
    step: SimulationSteps.Swap,
    optional: true,
  },
  {
    step: SimulationSteps.RepayFlashloan,
    optional: false,
  },
  {
    step: SimulationSteps.ReturnFunds,
    optional: true,
  },
  {
    step: SimulationSteps.NewPositionEvent,
    optional: false,
  },
])
