import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { ChainInfo, isChainInfo } from '@summerfi/sdk-common'

export const getUsersActivityRaw = publicProcedure
  .input(
    z.object({
      chainInfo: z.custom<ChainInfo>(isChainInfo),
      where: z.record(z.any()).optional(), // not ideal, but it's strong typed in the client
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.positions.getUsersActivityRaw(opts.input)
  })
