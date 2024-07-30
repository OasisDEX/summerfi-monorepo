import { StateReducers } from '@summerfi/simulator-common/types'
import { DMASimulatorStepsTypes } from '../enums/DMASimulatorStepsTypes'
import { DMASimulationState } from '../interfaces/DMASimulationState'
import { DMASimulatorSteps } from './DMASimulatorSteps'
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

/**
 * Specific reducers for each step type in the DMA Simulator
 *
 * The reducers are used to update the state of the simulation after each step
 */
export const DMAStateReducers: StateReducers<
  typeof DMASimulatorStepsTypes,
  DMASimulatorSteps,
  DMASimulationState
> = {
  [DMASimulatorStepsTypes.Flashloan]: flashloanReducer,
  [DMASimulatorStepsTypes.DepositBorrow]: depositBorrowReducer,
  [DMASimulatorStepsTypes.PaybackWithdraw]: paybackWithdrawReducer,
  [DMASimulatorStepsTypes.Swap]: swapReducer,
  [DMASimulatorStepsTypes.ReturnFunds]: returnFundsReducer,
  [DMASimulatorStepsTypes.RepayFlashloan]: repayFlashloanReducer,
  [DMASimulatorStepsTypes.PullToken]: pullTokenReducer,
  [DMASimulatorStepsTypes.Import]: importReducer,
  [DMASimulatorStepsTypes.NewPositionEvent]: newPositionEventReducer,
  [DMASimulatorStepsTypes.OpenPosition]: openPositionReducer,
  [DMASimulatorStepsTypes.Skipped]: skippedStepReducer,
}
