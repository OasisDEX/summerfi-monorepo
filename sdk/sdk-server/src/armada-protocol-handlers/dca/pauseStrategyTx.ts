import { isChainId, type ChainId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { strategyIdSchema } from './strategyConfigSchema'

export const pauseStrategyTx = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      strategyId: strategyIdSchema,
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.dca.pauseStrategyTx(opts.input)
  })
