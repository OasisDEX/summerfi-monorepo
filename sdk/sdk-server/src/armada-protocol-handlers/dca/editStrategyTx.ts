import { publicProcedure } from '../../SDKTRPC'
import { editStrategyTxInputSchema } from './strategyConfigSchema'

/** @see IDCAManager.editStrategyTx */
export const editStrategyTx = publicProcedure
  .input(editStrategyTxInputSchema)
  .query(async (opts) => {
    return opts.ctx.armadaManager.dca.editStrategyTx(opts.input)
  })
