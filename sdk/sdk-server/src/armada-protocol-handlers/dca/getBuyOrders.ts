import { isChainInfo, isUser, type IChainInfo, type IUser } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getBuyOrders = publicProcedure
  .input(
    z.object({
      user: z.custom<IUser>(isUser),
      chainInfo: z.custom<IChainInfo>(isChainInfo).optional(),
      status: z.enum(['active', 'cancelled']).optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.dca.getBuyOrders(opts.input)
  })
