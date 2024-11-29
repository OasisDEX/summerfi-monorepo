import { isArmadaVaultId, type IArmadaVaultId } from '@summerfi/armada-protocol-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isUser, type IUser } from '@summerfi/sdk-common'

export const getStakedBalance = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      user: z.custom<IUser>(isUser),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.getStakedBalance(opts.input)
  })
