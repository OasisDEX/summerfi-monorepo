import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { ChainInfo, isChainInfo } from '@summerfi/sdk-common'

export const getUsersActivityRaw = publicProcedure
  .input(
    z.object({
      chainInfo: z.custom<ChainInfo>(isChainInfo),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.getUsersActivityRaw(opts.input)
  })
