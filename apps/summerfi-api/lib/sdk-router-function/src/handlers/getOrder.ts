import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import type { Order, Simulation, SimulationType } from '@summerfi/sdk-common/orders'
import type { User } from '@summerfi/sdk-common/client'
import type { IPositionsManager } from '@summerfi/sdk-common/client'
import { OrderPlannerService } from '@summerfi/order-planner-service/implementation'
import { Maybe } from '@summerfi/sdk-common/utils'

export const getOrder = publicProcedure
  .input(
    z.object({
      user: z.custom<User>((user) => user !== undefined),
      positionsManager: z.custom<IPositionsManager>(
        (positionsManager) => positionsManager !== undefined,
      ),
      simulation: z.custom<Simulation<SimulationType>>((simulation) => simulation !== undefined),
    }),
  )
  .query(async (opts): Promise<Maybe<Order>> => {
    if (!opts.ctx.deployments) {
      throw new Error('Deployments dependency not resolved correctly')
    }

    const orderPlannerService = new OrderPlannerService({ deployments: opts.ctx.deployments })

    return await orderPlannerService.buildOrder({
      user: opts.input.user,
      positionsManager: opts.input.positionsManager,
      simulation: opts.input.simulation,
    })
  })
