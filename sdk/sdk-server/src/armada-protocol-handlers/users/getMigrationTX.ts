import { IArmadaVaultId, isArmadaVaultId } from '@summerfi/armada-protocol-common'
import {
  IUser,
  isArmadaMigrationType,
  isPercentage,
  isTokenAmount,
  isUser,
  type ArmadaMigrationType,
  type IPercentage,
  type ITokenAmount,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getMigrationTX = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      user: z.custom<IUser>(isUser),
      shouldStake: z.boolean().optional(),
      slippage: z.custom<IPercentage>(isPercentage),
      positions: z.array(
        z.object({
          migrationType: z.custom<ArmadaMigrationType>(isArmadaMigrationType),
          amount: z.custom<ITokenAmount>(isTokenAmount),
          underlyingAmount: z.custom<ITokenAmount>(isTokenAmount),
        }),
      ),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.migrations.getMigrationTX(opts.input)
  })
