import { z } from 'zod'
import { Percentage } from '@summerfi/sdk-common/common'
import type { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { refinaceLendingToLending, type RefinanceDependencies } from '@summerfi/simulator-service'
import type { IRefinanceParameters } from '@summerfi/sdk-common/orders'
import { publicProcedure } from '../TRPC'

const inputSchema = z.custom<IRefinanceParameters>((parameters) => parameters !== undefined)

export const getRefinanceSimulation = publicProcedure
  .input(inputSchema)
  .query(async (opts): Promise<Simulation<SimulationType.Refinance>> => {
    const args: IRefinanceParameters = opts.input

    const dependencies: RefinanceDependencies = {
      swapManager: opts.ctx.swapManager,
      protocolManager: opts.ctx.protocolManager,
      // TODO: get summer fee from the config provider
      getSummerFee: () => Percentage.createFrom({ value: 0 }),
    }

    return refinaceLendingToLending(args, dependencies)
  })
