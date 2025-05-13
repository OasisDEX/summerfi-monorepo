import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { type IArmadaVaultId, isArmadaVaultId } from '@summerfi/sdk-common'

export const getVaultInfo = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.vaults.getVaultInfo(opts.input)
  })
