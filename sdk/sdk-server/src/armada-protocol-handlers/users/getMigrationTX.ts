import { IArmadaVaultId, isArmadaVaultId } from '@summerfi/armada-protocol-common'
import {
  IUser,
  isArmadaMigrationType,
  isChainInfo,
  isTokenAmount,
  isUser,
  type ArmadaMigrationType,
  type IChainInfo,
  type ITokenAmount,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getMigrationTX = publicProcedure
  .input(
    z.object({
      chainInfo: z.custom<IChainInfo>(isChainInfo),
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      user: z.custom<IUser>(isUser),
      shouldStake: z.boolean().optional(),
      positions: z.array(
        z.object({
          amount: z.custom<ITokenAmount>(isTokenAmount),
          migrationType: z.custom<ArmadaMigrationType>(isArmadaMigrationType),
        }),
      ),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.migrations.getMigrationTX(opts.input)
  })
