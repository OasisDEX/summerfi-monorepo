import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isChainId, isAddressValue, type ChainId, type AddressValue } from '@summerfi/sdk-common'

export const getAllRoles = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      first: z.number().int().min(1).max(1000).optional(),
      skip: z.number().int().min(0).optional(),
      name: z.string().optional(),
      targetContract: z.custom<AddressValue>(isAddressValue).optional(),
      owner: z.custom<AddressValue>(isAddressValue).optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.accessControl.getAllRoles(opts.input)
  })
