import { IArmadaVaultId, isArmadaVaultId } from '@summerfi/armada-protocol-common'
import { IUser, isTokenAmount, isUser, type ITokenAmount } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getDepositTX = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      user: z.custom<IUser>(isUser),
      assets: z.custom<ITokenAmount>(isTokenAmount),
      shouldStake: z.boolean().optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.getNewDepositTX(opts.input)
  })
