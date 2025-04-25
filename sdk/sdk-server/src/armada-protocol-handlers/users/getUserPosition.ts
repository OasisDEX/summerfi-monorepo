import {
  isAddress,
  isUser,
  type IAddress,
  type IArmadaPosition,
  type IUser,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getUserPosition = publicProcedure
  .input(
    z.object({
      user: z.custom<IUser>(isUser),
      fleetAddress: z.custom<IAddress>(isAddress),
    }),
  )
  .query(async (opts): Promise<IArmadaPosition> => {
    return opts.ctx.armadaManager.utils.getUserPosition(opts.input)
  })
