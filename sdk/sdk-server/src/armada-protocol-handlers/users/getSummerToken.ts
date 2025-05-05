import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isChainInfo, type IChainInfo } from '@summerfi/sdk-common'

export const getSummerToken = publicProcedure
  .input(
    z.object({
      chainInfo: z.custom<IChainInfo>(isChainInfo),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.utils.getSummerToken(opts.input)
  })
