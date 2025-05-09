import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { ChainId, isChainId } from '@summerfi/sdk-common'

export const getVaultInfoList = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.vaults.getVaultInfoList(opts.input)
  })
