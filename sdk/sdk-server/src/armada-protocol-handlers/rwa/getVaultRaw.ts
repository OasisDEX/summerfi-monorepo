import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isArmadaVaultId, type IArmadaVaultId } from '@summerfi/sdk-common'

/** @see IRWAManager.getVaultRaw */
export const getVaultRaw = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.rwaManager.getVaultRaw(opts.input)
  })
