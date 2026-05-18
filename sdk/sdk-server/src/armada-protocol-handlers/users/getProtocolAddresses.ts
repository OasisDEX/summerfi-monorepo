import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isChainId, type ChainId } from '@summerfi/sdk-common'

export const getProtocolAddresses = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.utils.getProtocolAddresses(opts.input)
  })
