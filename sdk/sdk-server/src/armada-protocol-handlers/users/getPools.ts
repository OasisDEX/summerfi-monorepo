import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { ChainInfo, isChainInfo } from '@summerfi/sdk-common'

export const getPools = publicProcedure
  .input(
    z.object({
      chainInfo: z.custom<ChainInfo>(isChainInfo),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.getPools(opts.input)
  })
