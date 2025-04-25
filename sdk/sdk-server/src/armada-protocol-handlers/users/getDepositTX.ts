import {
  IUser,
  isArmadaVaultId,
  isPercentage,
  isTokenAmount,
  isUser,
  type IArmadaVaultId,
  type IPercentage,
  type ITokenAmount,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getDepositTX = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      user: z.custom<IUser>(isUser),
      amount: z.custom<ITokenAmount>(isTokenAmount),
      slippage: z.custom<IPercentage>(isPercentage),
      shouldStake: z.boolean().optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.vaults.getNewDepositTX(opts.input)
  })
