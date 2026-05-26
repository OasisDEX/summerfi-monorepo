import { publicProcedure } from '../../SDKTRPC'
import { editDcaStrategyTxInputSchema } from './strategyConfigSchema'

export const editStrategyTx = publicProcedure
  .input(editDcaStrategyTxInputSchema)
  .query(async (opts) => {
    return opts.ctx.armadaManager.dca.editStrategyTx(opts.input)
  })
