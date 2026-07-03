import { publicProcedure } from '../../SDKTRPC'
import { depositAndCreateStrategyTxInputSchema } from './strategyConfigSchema'

/** @see IDCAManager.depositAndCreateStrategyTx */
export const depositAndCreateStrategyTx = publicProcedure
  .input(depositAndCreateStrategyTxInputSchema)
  .query(async (opts) => {
    return opts.ctx.armadaManager.dca.depositAndCreateStrategyTx(opts.input)
  })
