import { isChainId, isHexData, type ChainId, type HexData } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { strategyConfigSchema } from './strategyConfigSchema'

export const executeDCATx = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      strategyConfig: strategyConfigSchema,
      ensoData: z.custom<HexData>(isHexData),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.dca.executeDCATx(opts.input)
  })