import { isAddress, isArmadaVaultId, type IAddress, type IArmadaVaultId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getSetWhitelistedTx = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      account: z.custom<IAddress>(isAddress),
      allowed: z.boolean(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.rwa.getSetWhitelistedTx(opts.input)
  })
