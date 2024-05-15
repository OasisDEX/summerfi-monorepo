import type { ISimulation, RefinanceSimulationTypes } from '@summerfi/sdk-common/simulation'
import { refinanceStrategyRouter } from '@summerfi/simulator-service/strategies'
import { publicProcedure } from '../TRPC'
import { isRefinanceParameters } from '@summerfi/sdk-common/orders'
import { z } from 'zod'

export const getRefinanceSimulation = publicProcedure
  .input(z.any())
  .query(async (opts): Promise<ISimulation<RefinanceSimulationTypes>> => {
    if (!isRefinanceParameters(opts.input)) {
      throw new Error('Invalid refinance parameters')
    }

    return refinanceStrategyRouter({
      refinanceParameters: opts.input,
      refinanceDependencies: {
        swapManager: opts.ctx.swapManager,
        oracleManager: opts.ctx.oracleManager,
        protocolManager: opts.ctx.protocolManager,
      },
    })
  })
