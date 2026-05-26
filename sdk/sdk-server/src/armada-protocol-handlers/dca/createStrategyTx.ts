import { publicProcedure } from '../../SDKTRPC'
import { createDcaStrategyTxInputSchema } from './strategyConfigSchema'

export const createStrategyTx = publicProcedure
  .input(createDcaStrategyTxInputSchema)
  .query(async (opts) => {
    return opts.ctx.armadaManager.dca.createStrategyTx(opts.input)
  })
