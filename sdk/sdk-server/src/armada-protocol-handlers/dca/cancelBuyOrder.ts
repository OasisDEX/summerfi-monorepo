import { isUser, type IUser } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const cancelBuyOrder = publicProcedure
  .input(
    z.object({
      orderId: z.string().uuid(),
      user: z.custom<IUser>(isUser),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.dca.cancelBuyOrder(opts.input)
  })
