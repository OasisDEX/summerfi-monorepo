import {
  refinanceLendingToLending,
  type RefinanceDependencies,
} from '@summerfi/simulator-service/strategies'
import { z } from 'zod'
import { Percentage } from '@summerfi/sdk-common/common'
import type { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import type { RefinanceParameters } from '@summerfi/sdk-common/orders'
import { publicProcedure } from '../TRPC'

const inputSchema = z.custom<RefinanceParameters>((parameters) => parameters !== undefined)

export const getRefinanceSimulation = publicProcedure
  .input(inputSchema)
  .query(async (opts): Promise<ISimulation<SimulationType.Refinance>> => {
    const args: RefinanceParameters = opts.input

    const dependencies: RefinanceDependencies = {
      swapManager: opts.ctx.swapManager,
      // TODO: get summer fee from the config provider
      getSummerFee: () => Percentage.createFrom({ percentage: 0 }),
    }

    const simulation = await refinanceLendingToLending(args, dependencies)
    return simulation
  })
