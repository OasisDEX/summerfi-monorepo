import { BalancesRecord, PositionsRecord, StepsRecord } from '../types/Types'

export interface SimulationState {
  balances: BalancesRecord
  positions: PositionsRecord
  steps: StepsRecord
}
