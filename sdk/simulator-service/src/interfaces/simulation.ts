import { BalancesRecord, PositionsRecord, StepsArray, SwapsArray } from '../types/Types'

export interface ISimulationState {
  swaps: SwapsArray
  balances: BalancesRecord
  positions: PositionsRecord
  steps: StepsArray
}
