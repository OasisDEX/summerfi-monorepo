import { isChainId, type ChainId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { dcaStrategySchema } from './strategyConfigSchema'

export const resumeStrategyTx = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      strategy: dcaStrategySchema,
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.dca.resumeStrategyTx(opts.input)
  })
