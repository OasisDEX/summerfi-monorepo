import { IArmadaVaultId, isArmadaVaultId } from '@summerfi/armada-protocol-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const updateRebalanceCooldown = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      cooldown: z.number(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.updateRebalanceCooldown(opts.input)
  })
