import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isUser, type IArmadaPosition, type IUser } from '@summerfi/sdk-common'

export const getUserPositions = publicProcedure
  .input(
    z.object({
      user: z.custom<IUser>(isUser),
    }),
  )
  .query(async (opts): Promise<IArmadaPosition[]> => {
    return opts.ctx.armadaManager.utils.getUserPositions(opts.input)
  })
