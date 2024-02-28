import { steps } from "@summerfi/sdk-common/simulation";
import { addBalance } from "~swap-service/implementation/helpers";
import { SimulationState } from "~swap-service/interfaces/simulation";

export function flashloanReducer(step: steps.FlashloanStep, state: SimulationState): SimulationState {
    return {
        ...state,
        steps: {
            [step.name]: step
        },
        balances: addBalance(step.inputs.amount, state.balances)
    };
}
