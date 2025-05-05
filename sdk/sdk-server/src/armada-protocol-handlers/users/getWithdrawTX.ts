import {
  IPercentage,
  isArmadaVaultId,
  isPercentage,
  isToken,
  isTokenAmount,
  isUser,
  type IArmadaVaultId,
  type IToken,
  type ITokenAmount,
  type IUser,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getWithdrawTx = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      user: z.custom<IUser>(isUser),
      amount: z.custom<ITokenAmount>(isTokenAmount),
      toToken: z.custom<IToken>(isToken),
      slippage: z.custom<IPercentage>(isPercentage),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.vaults.getWithdrawTx(opts.input)
  })
