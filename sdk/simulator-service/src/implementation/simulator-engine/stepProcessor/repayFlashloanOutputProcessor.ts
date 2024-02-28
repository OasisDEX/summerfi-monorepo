import { steps } from "@summerfi/sdk-common/simulation";
import type { StepOutputProcessor } from "~swap-service/interfaces/steps";

export const repayFlashloanOutputProcessor: StepOutputProcessor<steps.RepayFlashloan> = async (step) => {
    return {
        ...step,
        outputs: undefined
    };
};
