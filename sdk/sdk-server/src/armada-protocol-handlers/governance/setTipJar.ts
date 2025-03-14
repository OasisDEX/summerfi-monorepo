import { IArmadaVaultId, isArmadaVaultId } from '@summerfi/armada-protocol-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const setTipJar = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.setTipJar(opts.input)
  })
