import { AddressValue, isAddressValue } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getDelegateTxV2 = publicProcedure
  .input(
    z.object({
      delegateeAddress: z.custom<AddressValue>(isAddressValue),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getDelegateTxV2(opts.input)
  })
