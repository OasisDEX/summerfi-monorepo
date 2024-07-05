import { z } from 'zod'
import type { Order } from '@summerfi/sdk-common/orders'
import type { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { isUser } from '@summerfi/sdk-common/user'
import { Maybe } from '@summerfi/sdk-common/common'
import { publicProcedure } from '../SDKTRPC'
import { isPositionsManager } from '@summerfi/sdk-common'

export const buildOrder = publicProcedure
  .input(
    z.object({
      user: z.any(),
      positionsManager: z.any(),
      simulation: z.custom<ISimulation<SimulationType>>((simulation) => simulation !== undefined),
    }),
  )
  .mutation(async (opts): Promise<Maybe<Order>> => {
    if (!isUser(opts.input.user)) {
      throw new Error('Invalid user')
    }
    if (!isPositionsManager(opts.input.positionsManager)) {
      throw new Error('Invalid positions manager')
    }

    // TODO: validate Simulation with a type guard instead of a Zod schema

    return opts.ctx.orderPlannerService.buildOrder({
      user: opts.input.user,
      positionsManager: opts.input.positionsManager,
      simulation: opts.input.simulation,
      swapManager: opts.ctx.swapManager,
      addressBookManager: opts.ctx.addressBookManager,
      protocolsRegistry: opts.ctx.protocolsRegistry,
    })
  })
