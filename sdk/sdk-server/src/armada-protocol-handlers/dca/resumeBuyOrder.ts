import { isAddressValue, isHexData, type AddressValue, type HexData } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const resumeBuyOrder = publicProcedure
  .input(
    z.object({
      orderId: z.string().uuid(),
      userAddress: z.custom<AddressValue>(isAddressValue),
      signedMessage: z.string().min(1),
      signature: z.custom<HexData>(isHexData),
    }),
  )
  .mutation(async (opts) => {
    return opts.ctx.armadaManager.dca.resumeBuyOrder(opts.input)
  })
