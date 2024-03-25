import type { steps } from '@summerfi/sdk-common/simulation'
import type { TokenAmount, Position, Percentage } from '@summerfi/sdk-common/common'
import {QuoteData} from "@summerfi/swap-common/types";

export interface SimulationState {
  swaps: Record<string, SimulatedSwap>
  balances: Record<string, TokenAmount>
  positions: Record<string, Position>
  steps: Record<string /* step name */, steps.Steps>
}

type SimulatedSwap = QuoteData & {
  slippage: Percentage
  fee: Percentage
}
