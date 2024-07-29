import { StepOutputProcessors } from '@summerfi/simulator-common/types'
import { DMASimulatorStepsTypes } from '../../enums/DMASimulatorStepsTypes'
import { DMASimulatorSteps } from '../steps/DMASimulationSteps'
import { depositBorrowOutputProcessor } from './stepProcessor/depositBorrowOutputProcessor'
import { flashloanOutputProcessor } from './stepProcessor/flashloanOutputProcessor'
import { importPositionProcessor } from './stepProcessor/importPositionProcessor'
import { newPositionEventProcessor } from './stepProcessor/newPositionEvent'
import { openPositionProcessor } from './stepProcessor/openPositionProcessor'
import { paybackWithdrawOutputProcessor } from './stepProcessor/paybackWithdrawOutputProcessor'
import { pullTokenOutputProcessor } from './stepProcessor/pullTokenOutputProcessor'
import { repayFlashloanOutputProcessor } from './stepProcessor/repayFlashloanOutputProcessor'
import { returnFundsOutputProcessor } from './stepProcessor/returnFundsOutputProcessor'
import { skippedStepOutputProcessor } from './stepProcessor/skippedStepOutputProcessor'
import { swapOutputProcessor } from './stepProcessor/swapOutputProcessor'

export const DMAStepOutputProcessors: StepOutputProcessors<
  typeof DMASimulatorStepsTypes,
  DMASimulatorSteps
> = {
  [DMASimulatorStepsTypes.Flashloan]: flashloanOutputProcessor,
  [DMASimulatorStepsTypes.DepositBorrow]: depositBorrowOutputProcessor,
  [DMASimulatorStepsTypes.PaybackWithdraw]: paybackWithdrawOutputProcessor,
  [DMASimulatorStepsTypes.Swap]: swapOutputProcessor,
  [DMASimulatorStepsTypes.ReturnFunds]: returnFundsOutputProcessor,
  [DMASimulatorStepsTypes.RepayFlashloan]: repayFlashloanOutputProcessor,
  [DMASimulatorStepsTypes.PullToken]: pullTokenOutputProcessor,
  [DMASimulatorStepsTypes.Import]: importPositionProcessor,
  [DMASimulatorStepsTypes.NewPositionEvent]: newPositionEventProcessor,
  [DMASimulatorStepsTypes.OpenPosition]: openPositionProcessor,
  [DMASimulatorStepsTypes.Skipped]: skippedStepOutputProcessor,
}
