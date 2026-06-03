import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import {
  InstiContractRoles,
  isAddress,
  isChainId,
  type ChainId,
  type IAddress,
} from '@summerfi/sdk-common'

export const revokeContractSpecificRole = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      role: z.nativeEnum(InstiContractRoles),
      contractAddress: z.custom<IAddress>(isAddress),
      targetAddress: z.custom<IAddress>(isAddress),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.accessControl.revokeContractSpecificRole(opts.input)
  })
