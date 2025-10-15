import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isChainId, type ChainId, GlobalRoles } from '@summerfi/sdk-common'

export const getAllAddressesWithGlobalRole = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      role: z.nativeEnum(GlobalRoles),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.accessControl.getAllAddressesWithGlobalRole(opts.input)
  })
