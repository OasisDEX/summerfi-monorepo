import { isArmadaVaultId, type IArmadaVaultId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getSetWhitelistOpenTx = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      isOpen: z.boolean(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.rwa.getSetWhitelistOpenTx(opts.input)
  })
