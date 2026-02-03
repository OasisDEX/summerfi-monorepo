import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { ChainInfo, isChainInfo } from '@summerfi/sdk-common'

export const getGlobalRebalancesRaw = publicProcedure
  .input(
    z.object({
      chainInfo: z.custom<ChainInfo>(isChainInfo),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.positions.getGlobalRebalancesRaw(opts.input)
  })
