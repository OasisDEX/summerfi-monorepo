import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { type IArmadaVaultId, isArmadaVaultId } from '@summerfi/sdk-common'

export const getUserActivityRaw = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      accountAddress: z.string(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.getUserActivityRaw(opts.input)
  })
