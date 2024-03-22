import { z } from 'zod'
import type { IPositionsManager, Order } from '@summerfi/sdk-common/orders'
import type { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import type { IUser } from '@summerfi/sdk-common/user'
import { Maybe } from '@summerfi/sdk-common/common'
import { publicProcedure } from '../TRPC'

export const buildOrder = publicProcedure
  .input(
    z.object({
      user: z.custom<IUser>((user) => user !== undefined),
      positionsManager: z.custom<IPositionsManager>(
        (positionsManager) => positionsManager !== undefined,
      ),
      simulation: z.custom<Simulation<SimulationType>>((simulation) => simulation !== undefined),
    }),
  )
  .query(async (opts): Promise<Maybe<Order>> => {
    return opts.ctx.orderPlannerService.buildOrder({
      user: opts.input.user,
      positionsManager: opts.input.positionsManager,
      simulation: opts.input.simulation,
      swapManager: opts.ctx.swapManager,
      protocolsRegistry: opts.ctx.protocolsRegistry,
    })
  })
