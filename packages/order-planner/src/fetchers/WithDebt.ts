import { Simulation } from '@summerfi/sdk'
import { ActionParameterFetcher, ActionParameters } from '~orderplanner/interfaces'
import { WithDebtParams } from '~orderplanner/parameters'

export const WithDebt: ActionParameterFetcher = (simulation: Simulation): ActionParameters => {
  const { debtAmount } = simulation.simulationData
  return {
    debtAmount,
  } as WithDebtParams
}
