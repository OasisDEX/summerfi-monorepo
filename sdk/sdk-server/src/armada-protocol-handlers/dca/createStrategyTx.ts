import { publicProcedure } from '../../SDKTRPC'
import { createStrategyTxInputSchema } from './strategyConfigSchema'

export const createStrategyTx = publicProcedure
  .input(createStrategyTxInputSchema)
  .query(async (opts) => {
    return opts.ctx.armadaManager.dca.createStrategyTx(opts.input)
  })
