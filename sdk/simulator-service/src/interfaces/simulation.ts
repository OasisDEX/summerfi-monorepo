import { BalancesRecord, PositionsRecord, StepsRecord, SwapsRecord } from '../types/Types'

export interface ISimulationState {
  swaps: SwapsRecord
  balances: BalancesRecord
  positions: PositionsRecord
  steps: StepsRecord
}
