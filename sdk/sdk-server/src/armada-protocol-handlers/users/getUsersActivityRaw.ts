import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { ChainInfo, isChainInfo } from '@summerfi/sdk-common'

export const getUsersActivityRaw = publicProcedure
  .input(
    z.object({
      chainInfo: z.custom<ChainInfo>(isChainInfo),
      where: z
        .object({
          vault_: z
            .object({
              id_in: z.array(z.string()).optional(),
              id: z.string().optional(),
            })
            .optional(),
          account: z.string().optional(),
        })
        .optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.getUsersActivityRaw(opts.input)
  })
