import { isTokenAmount, isUser, type ITokenAmount, type IUser } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isArmadaVaultId, type IArmadaVaultId } from '@summerfi/armada-protocol-common'

export const getWithdrawTX = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      user: z.custom<IUser>(isUser),
      amount: z.custom<ITokenAmount>(isTokenAmount),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.getWithdrawTX(opts.input)
  })
