import { Simulation } from '@summerfi/sdk'
import { ActionParameterFetcher, ActionParameters } from '~orderplanner/interfaces'
import { WithCollateralParams } from '~orderplanner/parameters'

export const WithCollateral: ActionParameterFetcher = (
  simulation: Simulation,
): ActionParameters => {
  const { collateralAmount } = simulation.simulationData
  return {
    collateralAmount,
  } as WithCollateralParams
}
