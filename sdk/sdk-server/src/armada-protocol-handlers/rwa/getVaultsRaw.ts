import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { ChainInfo, isChainInfo } from '@summerfi/sdk-common'

/** @see IRWAManager.getVaultsRaw */
export const getVaultsRaw = publicProcedure
  .input(
    z.object({
      chainInfo: z.custom<ChainInfo>(isChainInfo),
      clientId: z.string().nonempty(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.rwaManager.getVaultsRaw(opts.input)
  })
