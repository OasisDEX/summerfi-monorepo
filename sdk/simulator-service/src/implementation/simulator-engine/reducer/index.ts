import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { SimulationState } from '~simulator-service/interfaces/simulation'
import type { StateReducer, StateReducers } from '~simulator-service/interfaces/steps'
import { flashloanReducer } from './flashloanReducer'
import { depositBorrowReducer } from './depositBorrowReducer'
import { paybackWithdrawReducer } from './paybackWithdrawReducer'
import { swapReducer } from './swapReducer'
import { returnFundsReducer } from './returnFundsReducer'
import { repayFlashloanReducer } from './repayFlashloanReducer'
import { pullTokenReducer } from './pullTokenReducer'

const stateReducers: StateReducers = {
  [SimulationSteps.Flashloan]: flashloanReducer,
  [SimulationSteps.DepositBorrow]: depositBorrowReducer,
  [SimulationSteps.PaybackWithdraw]: paybackWithdrawReducer,
  [SimulationSteps.Swap]: swapReducer,
  [SimulationSteps.ReturnFunds]: returnFundsReducer,
  [SimulationSteps.PaybackFlashloan]: repayFlashloanReducer,
  [SimulationSteps.PullToken]: pullTokenReducer,
}

export function stateReducer(step: steps.Steps, state: SimulationState): SimulationState {
  const reducer = stateReducers[step.type] as StateReducer<steps.Steps>

  return reducer(step, state)
}
