import { isArmadaVaultId, RoundsVaultType, type IArmadaVaultId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getCurrentRound = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      vaultType: z.nativeEnum(RoundsVaultType),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.rwa.getCurrentRound(opts.input)
  })
