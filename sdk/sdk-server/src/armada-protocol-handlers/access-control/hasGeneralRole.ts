import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { GeneralRoles } from '@summerfi/armada-protocol-common'
import { isAddress, isChainId, type ChainId, type IAddress } from '@summerfi/sdk-common'

export const hasGeneralRole = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      role: z.nativeEnum(GeneralRoles),
      targetAddress: z.custom<IAddress>(isAddress),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.accessControl.hasGeneralRole(opts.input)
  })
