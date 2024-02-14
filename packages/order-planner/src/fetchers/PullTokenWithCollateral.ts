import { Simulation, isRefinanceSimulation } from '@summerfi/sdk/orders'
import { ActionParameterFetcher } from '~orderplanner/interfaces'
import { PullTokenParameters } from '../protocols/common/types/PullTokenParameters'

export const PullTokenWithCollateral: ActionParameterFetcher = (
  simulation: Simulation,
): Partial<PullTokenParameters> => {
  // TODO: specific code for Refinance only, need to be adjusted
  // TODO: once the final Simulation data definition is available
  if (!isRefinanceSimulation(simulation)) {
    throw new Error('Invalid simulation data for PullTokenWithCollateral')
  }

  const { collateralAmount } = simulation.parameters.collateralAmount

  return {
    amount: collateralAmount,
  } as PullTokenParameters
}
