import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import { getMockOrder } from '@summerfi/sdk-common/mocks'
import type { Chain } from '@summerfi/sdk-common/chains'
import type { Wallet } from '@summerfi/sdk-common/common'
import type { Order, Simulation, SimulationType } from '@summerfi/sdk-common/orders'

type OrderParams = Parameters<typeof getMockOrder>[0]

export const getOrder = publicProcedure
  .input(
    z.object({
      chain: z.custom<Chain>((chain) => chain !== undefined),
      wallet: z.custom<Wallet>((wallet) => wallet !== undefined),
      simulation: z.custom<Simulation<SimulationType, unknown>>(
        (simulation) => simulation !== undefined,
      ),
    }),
  )
  .query(async (opts): Promise<Order> => {
    const params: OrderParams = opts.input
    return await getMockOrder(params)
  })
