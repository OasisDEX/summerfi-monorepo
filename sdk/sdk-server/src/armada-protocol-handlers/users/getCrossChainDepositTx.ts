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

export const getCrossChainDepositTx = publicProcedure
  .input(
    z.object({
      fromChainId: z.custom<ChainId>(isChainId),
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      user: z.custom<IUser>(isUser),
      amount: z.custom<ITokenAmount>(isTokenAmount),
      slippage: z.custom<IPercentage>(isPercentage),
      referralCode: z.string().optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.vaults.getCrossChainDepositTx(opts.input)
  })
