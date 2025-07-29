import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { AddressValue, isAddressValue, ChainIdSchema } from '@summerfi/sdk-common'

export const authorizeAsMerklRewardsOperatorTx = publicProcedure
  .input(
    z.object({
      chainId: ChainIdSchema,
      user: z.custom<AddressValue>(isAddressValue),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.merklRewards.authorizeAsMerklRewardsOperatorTx(opts.input)
  })
