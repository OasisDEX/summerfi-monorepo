import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import { getMockOrder } from '@summerfi/sdk-common/mocks'
import type { Order, Simulation, SimulationType } from '@summerfi/sdk-common/orders'
import type { User } from '@summerfi/sdk-common/client'
import type { PositionsManager } from '@summerfi/sdk-common/client'

type OrderParams = Parameters<typeof getMockOrder>[0]

export const getOrder = publicProcedure
  .input(
    z.object({
      user: z.custom<User>((user) => user !== undefined),
      positionsManager: z.custom<PositionsManager>(
        (positionsManager) => positionsManager !== undefined,
      ),
      simulation: z.custom<Simulation<SimulationType>>((simulation) => simulation !== undefined),
    }),
  )
  .query(async (opts): Promise<Order> => {
    const params: OrderParams = opts.input
    return await getMockOrder(params)
  })
