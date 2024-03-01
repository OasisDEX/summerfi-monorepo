import type { steps } from '@summerfi/sdk-common/simulation'
import type { TokenAmount, Position } from '@summerfi/sdk-common/common'

export interface SimulationState {
  balances: Record<string, TokenAmount>
  positions: Record<string, Position>
  steps: Record<string /* step name */, steps.Steps>
}
