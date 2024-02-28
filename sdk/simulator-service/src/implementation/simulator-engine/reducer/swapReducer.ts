import { steps } from "@summerfi/sdk-common/simulation";
import { addBalance, subtractBalance } from "~swap-service/implementation/helpers";
import { SimulationState } from "~swap-service/interfaces/simulation";

export function swapReducer(step: steps.SwapStep, state: SimulationState): SimulationState {
    const balanceWithoutFromToken = subtractBalance(step.inputs.fromTokenAmount, state.balances);
    const balanceWithToToken = addBalance(step.outputs.recievedAmount, balanceWithoutFromToken);
    return {
        ...state,
        steps: {
            [step.name]: step
        },
        balances: balanceWithToToken
    };
}
