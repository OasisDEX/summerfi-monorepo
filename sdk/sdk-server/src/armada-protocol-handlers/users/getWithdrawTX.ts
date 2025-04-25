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
import { TRPCError } from '@trpc/server'

export const getWithdrawTX = publicProcedure
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
    try {
      return await opts.ctx.armadaManager.vaults.getWithdrawTX(opts.input)
    } catch (error) {
      console.error(error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to call getWithdrawTX',
      })
    }
  })
