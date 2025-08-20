import { isArmadaVaultId, type IArmadaVaultId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const arks = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.admin.arks(opts.input)
  })
