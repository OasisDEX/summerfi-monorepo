import type { TokenAmount } from "@summerfi/sdk-common/common"
import type { steps } from "@summerfi/sdk-common/simulation"
import type { Position } from "@summerfi/sdk-common/users"

export interface SimulationState {
    balances: Record<string, TokenAmount>
    positions: Record<string, Position>
    steps: Record<string /* step name */, steps.Steps>
}