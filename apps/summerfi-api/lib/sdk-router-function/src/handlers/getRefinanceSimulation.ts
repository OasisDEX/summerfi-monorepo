import { z } from 'zod'
import type { RefinanceParameters, RefinanceSimulation } from '@summerfi/sdk-common/orders'
import type { Position } from '@summerfi/sdk-common/client'
import { providerProcedure } from '~src/procedures/providerProcedure'

const inputSchema = z.object({
  position: z.custom<Position>((position) => position !== undefined),
  pool: z.custom<Pool>((pool) => pool !== undefined),
  parameters: z.custom<RefinanceParameters>((parameters) => parameters !== undefined),
})

type SimulationParams = z.infer<typeof inputSchema>

export const getRefinanceSimulation = providerProcedure
  .input(inputSchema)
  .query(async (opts): Promise<RefinanceSimulation> => {
    const params: SimulationParams = opts.input

    opts.ctx.provider()
    throw new Error('Not implemented')
  })
