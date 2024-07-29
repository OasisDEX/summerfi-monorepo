import { SimulationSteps } from '@summerfi/sdk-common/simulation'

import { StateReducers } from '@summerfi/simulator-common/types'
import { DMASimulatorStepsTypes } from '../../enums/DMASimulatorStepsTypes'
import { DMASimulationState } from '../../interfaces/DMASimulationState'
import { DMASimulatorSteps } from '../steps/DMASimulationSteps'
import { depositBorrowReducer } from './reducer/depositBorrowReducer'
import { flashloanReducer } from './reducer/flashloanReducer'
import { importReducer } from './reducer/importReducer'
import { newPositionEventReducer } from './reducer/newPositionEventReducer'
import { openPositionReducer } from './reducer/openPositionReducer'
import { paybackWithdrawReducer } from './reducer/paybackWithdrawReducer'
import { pullTokenReducer } from './reducer/pullTokenReducer'
import { repayFlashloanReducer } from './reducer/repayFlashloanReducer'
import { returnFundsReducer } from './reducer/returnFundsReducer'
import { skippedStepReducer } from './reducer/skippedStepReducer'
import { swapReducer } from './reducer/swapReducer'

export const DMAStateReducers: StateReducers<
  typeof DMASimulatorStepsTypes,
  DMASimulatorSteps,
  DMASimulationState
> = {
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
  [SimulationSteps.Skipped]: skippedStepReducer,
}
