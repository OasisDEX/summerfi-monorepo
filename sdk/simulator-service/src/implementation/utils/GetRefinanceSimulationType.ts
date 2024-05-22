import { RefinanceSimulationTypes, SimulationType } from '@summerfi/sdk-common/simulation'

export function getRefinanceSimulationType(
  hasCollateralSwap: boolean,
  hasDebtSwap: boolean,
): RefinanceSimulationTypes {
  if (hasCollateralSwap && hasDebtSwap) {
    return SimulationType.RefinanceDifferentPair
  }

  if (hasCollateralSwap) {
    return SimulationType.RefinanceDifferentCollateral
  }

  if (hasDebtSwap) {
    return SimulationType.RefinanceDifferentDebt
  }

  return SimulationType.Refinance
}
