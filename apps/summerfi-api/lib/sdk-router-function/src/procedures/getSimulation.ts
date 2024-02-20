import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import { mockRefinanceSimulation } from '@summerfi/sdk-common/mocks'
import type { RefinanceParameters, RefinanceSimulation } from '@summerfi/sdk-common/orders'
import type { Pool } from '@summerfi/sdk-common/protocols'
import type { Position } from '@summerfi/sdk-common/users'

type SimulationParams = Parameters<typeof mockRefinanceSimulation>[0]

export const getSimulation = publicProcedure
  .input(
    z.object({
      position: z.custom<Position>((position) => position !== undefined),
      pool: z.custom<Pool>((pool) => pool !== undefined),
      parameters: z.custom<RefinanceParameters>((parameters) => parameters !== undefined),
    }),
  )
  .query(async (opts): Promise<RefinanceSimulation> => {
    const params: SimulationParams = opts.input
    return await mockRefinanceSimulation(params)
  })
