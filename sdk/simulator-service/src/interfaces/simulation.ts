import type { steps } from '@summerfi/sdk-common/simulation'
import type { TokenAmount, Position } from '@summerfi/sdk-common/common'
import type { SimulatedSwapData } from '@summerfi/sdk-common/swap'

export interface ISimulationState {
  swaps: Record<string, SimulatedSwapData>
  balances: Record<string, TokenAmount>
  positions: Record<string, Position>
  steps: Record<string /* step name */, steps.Steps>
}