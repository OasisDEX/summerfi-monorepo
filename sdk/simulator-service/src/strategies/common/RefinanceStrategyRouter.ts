import { IRefinanceParameters } from '@summerfi/sdk-common/orders'
import { refinanceLendingToLendingAnyPair } from '../refinanceAnyPair/RefinanceLendingToLendingAnyPair'
import { refinanceLendingToLendingNoDebt } from '../refinanceNoDebt/RefinanceLendingToLendingNoDebt'
import { refinanceLendingToLendingSamePair } from '../refinanceSamePair/RefinanceLendingToLendingSamePair'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { IOracleManager } from '@summerfi/oracle-common'
import { IProtocolManager } from '@summerfi/protocol-manager-common'

function isToSamePair(parameters: IRefinanceParameters): boolean {
  const { sourcePosition, targetPosition } = parameters

  return (
    sourcePosition.debtAmount.token.equals(targetPosition.debtAmount.token) &&
    sourcePosition.collateralAmount.token.equals(targetPosition.collateralAmount.token)
  )
}

/**
 * Choses the correct refinance strategy based on the parameters
 * @param refinanceParameters Parameters for the refinance simulation
 * @param refinanceDependencies Dependencies for the simulation
 * @returns The simulation result
 */
export function refinanceStrategyRouter(params: {
  refinanceParameters: IRefinanceParameters
  refinanceDependencies: {
    swapManager: ISwapManager
    oracleManager: IOracleManager
    protocolManager: IProtocolManager
  }
}) {
  if (params.refinanceParameters.sourcePosition.debtAmount.amount === '0') {
    return refinanceLendingToLendingNoDebt(params.refinanceParameters, params.refinanceDependencies)
  }

  // TODO: in the end we should use just any pair
  if (isToSamePair(params.refinanceParameters)) {
    return refinanceLendingToLendingSamePair(
      params.refinanceParameters,
      params.refinanceDependencies,
    )
  }

  return refinanceLendingToLendingAnyPair(params.refinanceParameters, params.refinanceDependencies)
}
