import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import {
  isAddress,
  isChainId,
  type ChainId,
  type IAddress,
  GlobalRoles,
} from '@summerfi/sdk-common'

export const hasGlobalRole = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      role: z.nativeEnum(GlobalRoles),
      targetAddress: z.custom<IAddress>(isAddress),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.accessControl.hasGlobalRole(opts.input)
  })
