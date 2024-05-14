import { z } from 'zod'
import type { ISimulation, RefinanceSimulationTypes } from '@summerfi/sdk-common/simulation'
import {
  refinanceLendingToLendingSamePair,
  type IRefinanceDependencies,
  refinanceLendingToLendingAnyPair,
  refinanceLendingToLendingNoDebt,
} from '@summerfi/simulator-service/strategies'
import type { IRefinanceParameters } from '@summerfi/sdk-common/orders'
import { publicProcedure } from '../TRPC'
import { Token } from '@summerfi/sdk-common/common'

const inputSchema = z.custom<IRefinanceParameters>((parameters) => parameters !== undefined)

function isToSamePair(parameters: IRefinanceParameters): boolean {
  const sourceDebtToken = Token.createFrom(parameters.sourcePosition.debtAmount.token)
  const targetDebtToken = Token.createFrom(parameters.targetPosition.debtAmount.token)
  const sourceCollateralToken = Token.createFrom(parameters.sourcePosition.collateralAmount.token)
  const targetCollateralToken = Token.createFrom(parameters.targetPosition.collateralAmount.token)

  return (
    sourceDebtToken.equals(targetDebtToken) && sourceCollateralToken.equals(targetCollateralToken)
  )
}

export const getRefinanceSimulation = publicProcedure
  .input(inputSchema)
  .query(async (opts): Promise<ISimulation<RefinanceSimulationTypes>> => {
    const args: IRefinanceParameters = opts.input

    const dependencies: IRefinanceDependencies = {
      swapManager: opts.ctx.swapManager,
      oracleManager: opts.ctx.oracleManager,
      protocolManager: opts.ctx.protocolManager,
    }

    if (opts.input.sourcePosition.debtAmount.amount === '0') {
      return refinanceLendingToLendingNoDebt(args, dependencies)
    }

    // TODO: in the end we should use just any pair
    if (isToSamePair(opts.input)) {
      return refinanceLendingToLendingSamePair(args, dependencies)
    }

    return refinanceLendingToLendingAnyPair(args, dependencies)
  })
