import { isAddressValue, type AddressValue } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getBuyOrder = publicProcedure
  .input(
    z.object({
      orderId: z.string().uuid(),
      userAddress: z.custom<AddressValue>(isAddressValue),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.dca.getBuyOrder(opts.input)
  })
