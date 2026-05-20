import { isChainId, type ChainId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { oracleAddressesSchema, orderSchema } from './strategyConfigSchema'

export const createStrategyTx = publicProcedure
  .input(
    z
      .object({
        chainId: z.custom<ChainId>(isChainId),
        order: orderSchema,
      })
      .merge(oracleAddressesSchema),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.dca.createStrategyTx(opts.input)
  })
