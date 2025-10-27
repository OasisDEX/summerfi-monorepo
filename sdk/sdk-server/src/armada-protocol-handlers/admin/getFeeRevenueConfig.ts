import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { type ChainId, isChainId } from '@summerfi/sdk-common'

export const getFeeRevenueConfig = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.admin.getFeeRevenueConfig(opts.input)
  })
