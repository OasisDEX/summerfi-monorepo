import { z } from 'zod'
import type { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import {
  refinanceLendingToLending,
  type IRefinanceDependencies,
} from '@summerfi/simulator-service/strategies'
import type { IRefinanceParameters } from '@summerfi/sdk-common/orders'
import { publicProcedure } from '../TRPC'

const inputSchema = z.custom<IRefinanceParameters>((parameters) => parameters !== undefined)

export const getRefinanceSimulation = publicProcedure
  .input(inputSchema)
  .query(async (opts): Promise<ISimulation<SimulationType.Refinance>> => {
    const args: IRefinanceParameters = opts.input

    const dependencies: IRefinanceDependencies = {
      swapManager: opts.ctx.swapManager,
      protocolManager: opts.ctx.protocolManager,
    }

    const simulation = await refinanceLendingToLending(args, dependencies)
    return simulation
  })
