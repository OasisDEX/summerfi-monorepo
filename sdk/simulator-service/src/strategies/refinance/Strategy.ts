import { SimulationSteps } from '@summerfi/sdk-common/simulation'
import { makeStrategy } from '../../implementation/utils'

export const refinanceLendingToLendingStrategy = makeStrategy([
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
    // In case of target debt being different then source debt we need a swap,
    // We cannot forsee the exact amount of the swap, so we need to return excess tokens to user
    step: SimulationSteps.ReturnFunds,
    optional: true,
  },
  {
    step: SimulationSteps.NewPositionEvent,
    optional: false,
  },
])
