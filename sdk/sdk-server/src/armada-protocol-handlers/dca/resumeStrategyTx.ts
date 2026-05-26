import { isChainId, type ChainId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { strategySchema, strategyIdSchema } from './strategyConfigSchema'

export const resumeStrategyTx = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      strategy: strategySchema,
      strategyId: strategyIdSchema,
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.dca.resumeStrategyTx(opts.input)
  })
