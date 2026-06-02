import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { ChainId, isChainId } from '@summerfi/sdk-common'

export const getVaultInfoListPerChain = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      clientId: z.string().nonempty(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.rwaManager.getVaultInfoListPerChain(opts.input)
  })
