import {
  isAddress,
  isArmadaVaultId,
  type IAddress,
  type IArmadaVaultId,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const addArks = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      arks: z.array(z.custom<IAddress>(isAddress)),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.admin.addArks(opts.input)
  })
