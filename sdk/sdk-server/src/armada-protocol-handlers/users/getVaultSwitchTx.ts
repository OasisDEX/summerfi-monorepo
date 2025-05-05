import {
  IPercentage,
  isArmadaVaultId,
  isPercentage,
  isTokenAmount,
  isUser,
  type IArmadaVaultId,
  type ITokenAmount,
  type IUser,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getVaultSwitchTx = publicProcedure
  .input(
    z.object({
      sourceVaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      destinationVaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      user: z.custom<IUser>(isUser),
      amount: z.custom<ITokenAmount>(isTokenAmount),
      slippage: z.custom<IPercentage>(isPercentage),
      shouldStake: z.boolean().optional(),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.vaults.getVaultSwitchTx(opts.input)
  })
