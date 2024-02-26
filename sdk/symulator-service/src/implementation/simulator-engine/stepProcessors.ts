import { SimulationSteps, steps } from "@summerfi/sdk-common/simulation"
import { getReferencedValue } from "~swap-service/implementation/helpers"
import type { StepOutputProcessor, StepOutputProcessors } from "~swap-service/interfaces/steps"

const flashloanOutputProcessor: StepOutputProcessor<steps.FlashloanStep> = async (step) => {
    return {
        ...step,
        outputs: undefined
    }
}

const pullTokenOutputProcessor: StepOutputProcessor<steps.PullTokenStep> = async (step) => {
    return {
        ...step,
        outputs: undefined
    }
}

const depositBorrowOutputProcessor: StepOutputProcessor<steps.DepositBorrowStep> = async (step) => {
    const depositAmount = step.inputs.additionalDeposit
        ? getReferencedValue(step.inputs.additionalDeposit).add(getReferencedValue(step.inputs.depositAmount))
        : getReferencedValue(step.inputs.depositAmount)

    return {
        ...step,
        outputs: {
            depositAmount: depositAmount,
            borrowAmount: getReferencedValue(step.inputs.borrowAmount)
        }
    }
}

const paybackWithdrawOutputProcessor: StepOutputProcessor<steps.PaybackWithdrawStep> = async (step) => {
    const paybackAmount = getReferencedValue(step.inputs.paybackAmount).amount > step.inputs.position.debtAmount.amount
        ? step.inputs.position.debtAmount
        : getReferencedValue(step.inputs.paybackAmount)

    const withdrawAmount = getReferencedValue(step.inputs.withdrawAmount).amount > step.inputs.position.collateralAmount.amount
        ? step.inputs.position.collateralAmount
        : getReferencedValue(step.inputs.withdrawAmount)

    return {
        ...step,
        outputs: {
            paybackAmount: paybackAmount,
            withdrawAmount: withdrawAmount
        }
    }
}

const swapOutputProcessor: StepOutputProcessor<steps.SwapStep> = async (step) => {
    return {
        ...step,
        outputs: {
            recievedAmount: step.inputs.toTokenAmount
        }
    }
}

const returnFundsOutputProcessor: StepOutputProcessor<steps.ReturnFunds> = async (step) => {
    return {
        ...step,
        outputs: undefined
    }
}

const repayFlashloanOutputProcessor: StepOutputProcessor<steps.RepayFlashloan> = async (step) => {
    return {
        ...step,
        outputs: undefined
    }
}

export const stepOutputProcessors: StepOutputProcessors = {
    [SimulationSteps.Flashloan]: flashloanOutputProcessor,
    [SimulationSteps.DepositBorrow]: depositBorrowOutputProcessor,
    [SimulationSteps.PaybackWithdraw]: paybackWithdrawOutputProcessor,
    [SimulationSteps.Swap]: swapOutputProcessor,
    [SimulationSteps.ReturnFunds]: returnFundsOutputProcessor,
    [SimulationSteps.PaybackFlashloan]: repayFlashloanOutputProcessor,
    [SimulationSteps.PullToken]: pullTokenOutputProcessor,
}