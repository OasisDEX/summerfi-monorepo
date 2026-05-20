import { isChainId, type ChainId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { oracleAddressesSchema, orderSchema, strategyIdSchema } from './strategyConfigSchema'

export const resumeStrategyTx = publicProcedure
  .input(
    z
      .object({
        chainId: z.custom<ChainId>(isChainId),
        order: orderSchema,
        strategyId: strategyIdSchema,
      })
      .merge(oracleAddressesSchema),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.dca.resumeStrategyTx(opts.input)
  })
