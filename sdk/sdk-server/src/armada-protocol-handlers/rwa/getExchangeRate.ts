import { isArmadaVaultId, RoundsVaultType, type IArmadaVaultId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getExchangeRate = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      roundId: z.bigint(),
      vaultType: z.nativeEnum(RoundsVaultType),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.rwa.getExchangeRate(opts.input)
  })
