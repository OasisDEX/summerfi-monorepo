import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isChainId, type ChainId, GeneralRoles } from '@summerfi/sdk-common'

export const getAllAddressesWithGeneralRole = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      role: z.nativeEnum(GeneralRoles),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.accessControl.getAllAddressesWithGeneralRole(opts.input)
  })
