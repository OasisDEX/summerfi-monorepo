import { z } from 'zod'
import { providerProcedure } from '~src/procedures/providerProcedure'
import type { Position } from '@summerfi/sdk-common/common'
import type { LendingPool } from '@summerfi/sdk-common/protocols'
import type { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { refinace, type RefinanceDependencies } from '@summerfi/simulator-service'
import type { RefinanceParameters } from '@summerfi/sdk-common/orders'

const inputSchema = z.object({
  position: z.custom<Position>((position) => position !== undefined),
  pool: z.custom<LendingPool>((pool) => pool !== undefined),
  parameters: z.custom<RefinanceParameters>((parameters) => parameters !== undefined),
})

type SimulationParams = z.infer<typeof inputSchema>

export const getRefinanceSimulation = providerProcedure
  .input(inputSchema)
  .query(async (opts): Promise<Simulation<SimulationType.Refinance>> => {
    const params: SimulationParams = opts.input
    const args: RefinanceParameters = params.parameters

    const dependencies: RefinanceDependencies = {
      getQuote: opts.ctx.getQuote,
    }

    const simulation = await refinace(args, dependencies)
    return simulation
  })
