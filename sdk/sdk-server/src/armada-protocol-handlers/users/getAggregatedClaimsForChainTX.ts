import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { IChainInfo, isChainInfo, isUser, type IUser } from '@summerfi/sdk-common'

export const getAggregatedClaimsForChainTx = publicProcedure
  .input(
    z.object({
      chainInfo: z.custom<IChainInfo>(isChainInfo),
      user: z.custom<IUser>(isUser),
      includeMerkl: z.boolean().optional(),
      includeStakingV2: z.boolean().optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.claims.getAggregatedClaimsForChainTx(opts.input)
  })
