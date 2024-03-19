import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'

import { flashloanOutputProcessor } from './flashloanOutputProcessor'
import { pullTokenOutputProcessor } from './pullTokenOutputProcessor'
import { depositBorrowOutputProcessor } from './depositBorrowOutputProcessor'
import { paybackWithdrawOutputProcessor } from './paybackWithdrawOutputProcessor'
import { swapOutputProcessor } from './swapOutputProcessor'
import { returnFundsOutputProcessor } from './returnFundsOutputProcessor'
import { repayFlashloanOutputProcessor } from './repayFlashloanOutputProcessor'
import {
  StepOutputProcessor,
  StepOutputProcessors,
  StepsWithoutOutputs,
} from '../../../interfaces/steps'

const stepOutputProcessors: StepOutputProcessors = {
  [SimulationSteps.Flashloan]: flashloanOutputProcessor,
  [SimulationSteps.DepositBorrow]: depositBorrowOutputProcessor,
  [SimulationSteps.PaybackWithdraw]: paybackWithdrawOutputProcessor,
  [SimulationSteps.Swap]: swapOutputProcessor,
  [SimulationSteps.ReturnFunds]: returnFundsOutputProcessor,
  [SimulationSteps.RepayFlashloan]: repayFlashloanOutputProcessor,
  [SimulationSteps.PullToken]: pullTokenOutputProcessor,
}

export async function processStepOutput(step: StepsWithoutOutputs): Promise<steps.Steps> {
  const processor = stepOutputProcessors[step.type] as StepOutputProcessor<steps.Steps>
  return processor(step)
}
