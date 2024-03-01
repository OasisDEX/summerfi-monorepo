import { z } from 'zod'
import type { RefinanceParameters } from '@summerfi/sdk-common/orders'
import { providerProcedure } from '~src/procedures/providerProcedure'
import type { Position } from '@summerfi/sdk-common/common'
import type { IPool } from '@summerfi/sdk-common/protocols'

const inputSchema = z.object({
  position: z.custom<Position>((position) => position !== undefined),
  pool: z.custom<IPool>((pool) => pool !== undefined),
  parameters: z.custom<RefinanceParameters>((parameters) => parameters !== undefined),
})

type SimulationParams = z.infer<typeof inputSchema>

export const getRefinanceSimulation = providerProcedure.input(inputSchema).query(async (opts) => {
  const params: SimulationParams = opts.input
  params
  throw new Error('Not implemented')
})
