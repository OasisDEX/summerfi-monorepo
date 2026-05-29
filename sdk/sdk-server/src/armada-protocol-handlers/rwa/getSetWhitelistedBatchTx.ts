import {
  isAddress,
  isArmadaVaultId,
  type IAddress,
  type IArmadaVaultId,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getSetWhitelistedBatchTx = publicProcedure
  .input(
    z
      .object({
        vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
        accounts: z.array(z.custom<IAddress>(isAddress)),
        allowed: z.array(z.boolean()),
      })
      .refine((params) => params.accounts.length === params.allowed.length, {
        message: 'accounts and allowed must have the same length',
      }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.rwa.getSetWhitelistedBatchTx(opts.input)
  })
