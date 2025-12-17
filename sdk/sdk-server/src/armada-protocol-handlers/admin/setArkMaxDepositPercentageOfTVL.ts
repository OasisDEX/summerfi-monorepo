import {
  IPercentage,
  isAddress,
  isArmadaVaultId,
  isPercentage,
  type IAddress,
  type IArmadaVaultId,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const setArkMaxDepositPercentageOfTVL = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      ark: z.custom<IAddress>(isAddress),
      maxDepositPercentageOfTVL: z.custom<IPercentage>(isPercentage),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.admin.setArkMaxDepositPercentageOfTVL(opts.input)
  })
