import { BalancesRecord, PositionsRecord, StepsArray, SwapArray } from '../types/Types'

export interface ISimulationState {
  swaps: SwapArray
  balances: BalancesRecord
  positions: PositionsRecord
  steps: StepsArray
}
