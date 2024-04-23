import { z } from 'zod'
import type { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import {
  refinanceLendingToLendingSamePair,
  type IRefinanceDependencies,
  refinanceLendingToLendingAnyPair,
  RefinanceSimulationTypes,
} from '@summerfi/simulator-service/strategies'
import type { IRefinanceParameters } from '@summerfi/sdk-common/orders'
import { publicProcedure } from '../TRPC'
import { isSameTokens } from '@summerfi/sdk-common/common'

const inputSchema = z.custom<IRefinanceParameters>((parameters) => parameters !== undefined)

function isToSamePair(parameters: IRefinanceParameters): boolean {
  return (
    isSameTokens(
      parameters.sourcePosition.debtAmount.token,
      parameters.targetPosition.debtAmount.token,
    ) &&
    isSameTokens(
      parameters.sourcePosition.collateralAmount.token,
      parameters.targetPosition.collateralAmount.token,
    )
  )
}

export const getRefinanceSimulation = publicProcedure
  .input(inputSchema)
  .query(async (opts): Promise<ISimulation<RefinanceSimulationTypes>> => {
    const args: IRefinanceParameters = opts.input

    const dependencies: IRefinanceDependencies = {
      swapManager: opts.ctx.swapManager,
      protocolManager: opts.ctx.protocolManager,
    }

    // TODO: in the end we should use just any pair
    if (isToSamePair(opts.input)) {
      return refinanceLendingToLendingSamePair(args, dependencies)
    }

    return refinanceLendingToLendingAnyPair(args, dependencies)
  })
