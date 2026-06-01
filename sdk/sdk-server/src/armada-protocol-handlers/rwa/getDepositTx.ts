import { isArmadaVaultId, isUser, type IArmadaVaultId, type IUser } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getDepositTx = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      user: z.custom<IUser>(isUser),
      assetsAmount: z.string(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.rwa.getDepositTx(opts.input)
  })
