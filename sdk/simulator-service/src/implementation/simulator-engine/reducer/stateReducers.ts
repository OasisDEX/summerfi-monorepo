import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { ISimulationState } from '../../../interfaces/simulation'
import type { StateReducer, StateReducers } from '../../../interfaces/steps'
import { flashloanReducer } from './flashloanReducer'
import { depositBorrowReducer } from './depositBorrowReducer'
import { paybackWithdrawReducer } from './paybackWithdrawReducer'
import { swapReducer } from './swapReducer'
import { returnFundsReducer } from './returnFundsReducer'
import { repayFlashloanReducer } from './repayFlashloanReducer'
import { pullTokenReducer } from './pullTokenReducer'
import { importReducer } from './importReducer'
import { newPositionEventReducer } from './newPositionEventReducer'
import { openPositionReducer } from './openPositionReducer'

const stateReducers: StateReducers = {
  [SimulationSteps.Flashloan]: flashloanReducer,
  [SimulationSteps.DepositBorrow]: depositBorrowReducer,
  [SimulationSteps.PaybackWithdraw]: paybackWithdrawReducer,
  [SimulationSteps.Swap]: swapReducer,
  [SimulationSteps.ReturnFunds]: returnFundsReducer,
  [SimulationSteps.RepayFlashloan]: repayFlashloanReducer,
  [SimulationSteps.PullToken]: pullTokenReducer,
  [SimulationSteps.Import]: importReducer,
  [SimulationSteps.NewPositionEvent]: newPositionEventReducer,
  [SimulationSteps.OpenPosition]: openPositionReducer,
}

export function stateReducer(step: steps.Steps, state: ISimulationState): ISimulationState {
  const reducer = stateReducers[step.type] as StateReducer<steps.Steps>

  return reducer(step, state)
}
