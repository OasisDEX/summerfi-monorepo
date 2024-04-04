import { steps } from '@summerfi/sdk-common/simulation'
import { addBalance } from '../../utils'
import { ISimulationState } from '../../../interfaces/simulation'

export function importReducer(
  _step: steps.ImportStep,
  state: ISimulationState,
): ISimulationState {
  return state
}
