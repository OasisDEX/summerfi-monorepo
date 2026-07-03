import { isChainId, type ChainId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { strategySchema } from './strategyConfigSchema'

/** @see IDCAManager.cancelStrategyTx */
export const cancelStrategyTx = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      strategy: strategySchema,
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.dca.cancelStrategyTx(opts.input)
  })
