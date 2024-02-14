import { ActionParameterFetcher } from '~orderplanner/interfaces'
import { PullTokenParameters } from '../protocols/common/types/PullTokenParameters'
import { Simulation, isRefinanceSimulation } from '@summerfi/sdk/orders/index'

export const PullTokenWithDebt: ActionParameterFetcher = (
  simulation: Simulation,
): PullTokenParameters => {
  // TODO: specific code for Refinance only, need to be adjusted
  // TODO: once the final Simulation data definition is available
  if (!isRefinanceSimulation(simulation)) {
    throw new Error('Invalid simulation data for PullTokenWithCollateral')
  }

  const { debtAmount } = simulation.parameters.debtAmount

  return {
    amount: debtAmount,
  } as PullTokenParameters
}
