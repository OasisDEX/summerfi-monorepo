import type { IArmadaPosition } from '@summerfi/armada-protocol-common'
import { isAddress, isUser, type IAddress, type IUser } from '@summerfi/sdk-common'
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
    return opts.ctx.armadaManager.getUserPosition(opts.input)
  })
