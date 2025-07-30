import {
  IPercentage,
  isArmadaVaultId,
  isPercentage,
  type IArmadaVaultId,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const setTipRate = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      rate: z.custom<IPercentage>(isPercentage),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.admin.setTipRate(opts.input)
  })
