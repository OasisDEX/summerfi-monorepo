import {
  isArmadaVaultId,
  isChainId,
  isPercentage,
  isTokenAmount,
  isUser,
  type ChainId,
  type IArmadaVaultId,
  type IPercentage,
  type ITokenAmount,
  type IUser,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getCrossChainWithdrawTx = publicProcedure
  .input(
    z.object({
      toChainId: z.custom<ChainId>(isChainId),
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      user: z.custom<IUser>(isUser),
      amount: z.custom<ITokenAmount>(isTokenAmount),
      slippage: z.custom<IPercentage>(isPercentage),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.vaults.getCrossChainWithdrawTx(opts.input)
  })
