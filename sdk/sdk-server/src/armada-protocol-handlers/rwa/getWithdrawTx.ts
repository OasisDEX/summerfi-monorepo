import { isArmadaVaultId, isUser, type IArmadaVaultId, type IUser } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getWithdrawTx = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      user: z.custom<IUser>(isUser),
      sharesAmount: z.string(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.rwa.getWithdrawTx(opts.input)
  })
