import { AddressValue, isAddressValue } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getUserDelegateeV2 = publicProcedure
  .input(
    z.object({
      userAddress: z.custom<AddressValue>(isAddressValue),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getUserDelegateeV2(opts.input)
  })
