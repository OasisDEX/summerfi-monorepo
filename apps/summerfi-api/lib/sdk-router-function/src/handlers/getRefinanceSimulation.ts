import { z } from 'zod'
import type { RefinanceParameters } from '@summerfi/sdk-common/orders'
import { providerProcedure } from '~src/procedures/providerProcedure'
import type { Position } from '@summerfi/sdk-common/common/implementation'
import type { Pool } from '@summerfi/sdk-common/protocols'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'

const inputSchema = z.object({
  position: z.custom<Position>((position) => position !== undefined),
  pool: z.custom<Pool>((pool) => pool !== undefined),
  parameters: z.custom<RefinanceParameters>((parameters) => parameters !== undefined),
})

type SimulationParams = z.infer<typeof inputSchema>

export const getRefinanceSimulation = providerProcedure
  .input(inputSchema)
  .query(async (opts): Promise<Simulation<SimulationType.Refinance>> => {
    const params: SimulationParams = opts.input
    params
    throw new Error('Not implemented')
  })
