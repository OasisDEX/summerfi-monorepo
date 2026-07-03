import {
  isAddressValue,
  isChainId,
  RwaRoleSchema,
  type AddressValue,
  type ChainId,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

/** @see IRWAManager.getGrantRoleTx */
export const getGrantRoleTx = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      role: RwaRoleSchema,
      account: z.custom<AddressValue>(isAddressValue),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.rwaManager.getGrantRoleTx(opts.input)
  })
