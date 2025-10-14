import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import {
  isAddress,
  isChainId,
  type ChainId,
  type IAddress,
  GeneralRoles,
} from '@summerfi/sdk-common'

export const grantGeneralRole = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      role: z.nativeEnum(GeneralRoles),
      targetAddress: z.custom<IAddress>(isAddress),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.accessControl.grantGeneralRole(opts.input)
  })
