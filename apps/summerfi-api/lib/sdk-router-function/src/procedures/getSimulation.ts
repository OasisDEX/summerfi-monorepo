import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import { mockRefinanceSimulation } from '@summerfi/sdk/mocks'
import type { RefinanceParameters } from '@summerfi/sdk/orders'
import type { Pool } from '@summerfi/sdk/protocols'
import type { Position } from '@summerfi/sdk/users'

type SimulationParams = Parameters<typeof mockRefinanceSimulation>[0]

export const getSimulation = publicProcedure
  .input(
    z.object({
      position: z.custom<Position>((chain) => chain !== undefined),
      pool: z.custom<Pool>((wallet) => wallet !== undefined),
      parameters: z.custom<RefinanceParameters>((simulation) => simulation !== undefined),
    }),
  )
  .query(async (opts) => {
    const params: SimulationParams = opts.input
    return await mockRefinanceSimulation(params)
  })
