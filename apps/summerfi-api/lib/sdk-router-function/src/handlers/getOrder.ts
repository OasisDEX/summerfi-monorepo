import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import { getMockOrder } from '@summerfi/sdk-common/mocks'
import type { Order, SimulationType } from '@summerfi/sdk-common/orders'
import type { Chain } from '@summerfi/sdk-common/client'
import type { Wallet } from '@summerfi/sdk-common/common/implementation'
import { Simulation } from '@summerfi/sdk-common/simulation'

type OrderParams = Parameters<typeof getMockOrder>[0]

export const getOrder = publicProcedure
  .input(
    z.object({
      chain: z.custom<Chain>((chain) => chain !== undefined),
      wallet: z.custom<Wallet>((wallet) => wallet !== undefined),
      simulation: z.custom<Simulation<SimulationType>>((simulation) => simulation !== undefined),
    }),
  )
  .query(async (opts): Promise<Order> => {
    const params: OrderParams = opts.input
    return await getMockOrder(params)
  })
