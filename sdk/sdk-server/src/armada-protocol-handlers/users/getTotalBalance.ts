import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isArmadaVaultId, isUser, type IArmadaVaultId, type IUser } from '@summerfi/sdk-common'

export const getTotalBalance = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      user: z.custom<IUser>(isUser),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.utils.getTotalBalance(opts.input)
  })
