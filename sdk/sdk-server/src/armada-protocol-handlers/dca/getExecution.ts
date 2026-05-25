import { isChainId, type ChainId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getExecution = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      strategyId: z.string(),
      executionId: z.string(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.dca.getExecution(opts.input)
  })
