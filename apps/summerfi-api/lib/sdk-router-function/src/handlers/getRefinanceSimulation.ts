import { z } from 'zod'
import type { Position } from '@summerfi/sdk-common/common'
import type { IPool } from '@summerfi/sdk-common/protocols'
import type { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { refinaceLendingToLending, type RefinanceDependencies } from '@summerfi/simulator-service'
import type { RefinanceParameters } from '@summerfi/sdk-common/orders'
import { publicProcedure } from '~src/trpc'

const inputSchema = z.object({
  position: z.custom<Position>((position) => position !== undefined),
  pool: z.custom<IPool>((pool) => pool !== undefined),
  parameters: z.custom<RefinanceParameters>((parameters) => parameters !== undefined),
})

type SimulationParams = z.infer<typeof inputSchema>

export const getRefinanceSimulation = publicProcedure
  .input(inputSchema)
  .query(async (opts): Promise<Simulation<SimulationType.Refinance>> => {
    const params: SimulationParams = opts.input
    const args: RefinanceParameters = params.parameters

    const dependencies: RefinanceDependencies = {
      swapManager: opts.ctx.swapManager,
      // TODO: get summer fee from the config provider
      getSummerFee: () => 0,
    }

    const simulation = await refinaceLendingToLending(args, dependencies)
    return simulation
  })
