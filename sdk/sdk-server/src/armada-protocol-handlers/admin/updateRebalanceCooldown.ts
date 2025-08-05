import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { type IArmadaVaultId, isArmadaVaultId } from '@summerfi/sdk-common'

export const updateRebalanceCooldown = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      cooldown: z.number(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.admin.updateRebalanceCooldown(opts.input)
  })
