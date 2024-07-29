import { ISimulationState } from '@summerfi/simulator-common/interfaces'
import { DMASimulatorStepsTypes } from '../enums/DMASimulatorStepsTypes'
import { DMASimulatorSteps } from '../implementation/steps/DMASimulationSteps'
import { BalancesRecord, PositionsRecord, SwapsArray } from '../types/Types'

/**
 * DMA Simulation specific state
 */
export interface DMASimulationState
  extends ISimulationState<typeof DMASimulatorStepsTypes, DMASimulatorSteps> {
  swaps: SwapsArray
  balances: BalancesRecord
  positions: PositionsRecord
}
