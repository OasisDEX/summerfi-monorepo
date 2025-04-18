import { SimulationSteps, steps } from '@summerfi/sdk-common'
import type {
  StepOutputProcessor,
  StepOutputProcessors,
  StepsWithoutOutputs,
} from '../../../interfaces/steps'
import { flashloanOutputProcessor } from './flashloanOutputProcessor'
import { pullTokenOutputProcessor } from './pullTokenOutputProcessor'
import { depositBorrowOutputProcessor } from './depositBorrowOutputProcessor'
import { paybackWithdrawOutputProcessor } from './paybackWithdrawOutputProcessor'
import { swapOutputProcessor } from './swapOutputProcessor'
import { returnFundsOutputProcessor } from './returnFundsOutputProcessor'
import { repayFlashloanOutputProcessor } from './repayFlashloanOutputProcessor'
import { importPositionProcessor } from './importPositionProcessor'
import { newPositionEventProcessor } from './newPositionEvent'
import { openPositionProcessor } from './openPositionProcessor'
import { skippedStepOutputProcessor } from './skippedStepOutputProcessor'

const stepOutputProcessors: StepOutputProcessors = {
  [SimulationSteps.Flashloan]: flashloanOutputProcessor,
  [SimulationSteps.DepositBorrow]: depositBorrowOutputProcessor,
  [SimulationSteps.PaybackWithdraw]: paybackWithdrawOutputProcessor,
  [SimulationSteps.Swap]: swapOutputProcessor,
  [SimulationSteps.ReturnFunds]: returnFundsOutputProcessor,
  [SimulationSteps.RepayFlashloan]: repayFlashloanOutputProcessor,
  [SimulationSteps.PullToken]: pullTokenOutputProcessor,
  [SimulationSteps.Import]: importPositionProcessor,
  [SimulationSteps.NewPositionEvent]: newPositionEventProcessor,
  [SimulationSteps.OpenPosition]: openPositionProcessor,
  [SimulationSteps.Skipped]: skippedStepOutputProcessor,
}

export async function processStepOutput(step: StepsWithoutOutputs): Promise<steps.Steps> {
  const processor = stepOutputProcessors[step.type] as StepOutputProcessor<steps.Steps>
  return processor(step)
}
