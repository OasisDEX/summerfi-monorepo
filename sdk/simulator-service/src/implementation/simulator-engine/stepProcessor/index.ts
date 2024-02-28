import { SimulationSteps, steps } from "@summerfi/sdk-common/simulation"
import type { StepOutputProcessor, StepOutputProcessors, StepsWithouOutputs } from "~swap-service/interfaces/steps"
import { flashloanOutputProcessor } from "./flashloanOutputProcessor"
import { pullTokenOutputProcessor } from "./pullTokenOutputProcessor"
import { depositBorrowOutputProcessor } from "./depositBorrowOutputProcessor"
import { paybackWithdrawOutputProcessor } from "./paybackWithdrawOutputProcessor"
import { swapOutputProcessor } from "./swapOutputProcessor"
import { returnFundsOutputProcessor } from "./returnFundsOutputProcessor"
import { repayFlashloanOutputProcessor } from "./repayFlashloanOutputProcessor"

const stepOutputProcessors: StepOutputProcessors = {
    [SimulationSteps.Flashloan]: flashloanOutputProcessor,
    [SimulationSteps.DepositBorrow]: depositBorrowOutputProcessor,
    [SimulationSteps.PaybackWithdraw]: paybackWithdrawOutputProcessor,
    [SimulationSteps.Swap]: swapOutputProcessor,
    [SimulationSteps.ReturnFunds]: returnFundsOutputProcessor,
    [SimulationSteps.PaybackFlashloan]: repayFlashloanOutputProcessor,
    [SimulationSteps.PullToken]: pullTokenOutputProcessor,
}

export async function processStepOutput(step: StepsWithouOutputs): Promise<steps.Steps> {
    const processor = stepOutputProcessors[step.type] as StepOutputProcessor<steps.Steps>
    return processor(step)
}