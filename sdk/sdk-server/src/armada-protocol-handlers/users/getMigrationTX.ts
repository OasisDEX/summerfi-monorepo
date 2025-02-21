import { IArmadaVaultId, isArmadaVaultId } from '@summerfi/armada-protocol-common'
import {
  AddressValue,
  IUser,
  isArmadaMigrationType,
  isFiatCurrencyAmount,
  isPercentage,
  isTokenAmount,
  isUser,
  type ArmadaMigrationType,
  type IFiatCurrencyAmount,
  type IPercentage,
  type ITokenAmount,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isHex } from 'viem'

export const getMigrationTX = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      user: z.custom<IUser>(isUser),
      shouldStake: z.boolean().optional(),
      slippage: z.custom<IPercentage>(isPercentage),
      positions: z.array(
        z.object({
          id: z.custom<AddressValue>(isHex),
          migrationType: z.custom<ArmadaMigrationType>(isArmadaMigrationType),
          positionTokenAmount: z.custom<ITokenAmount>(isTokenAmount),
          underlyingTokenAmount: z.custom<ITokenAmount>(isTokenAmount),
          usdValue: z.custom<IFiatCurrencyAmount>(isFiatCurrencyAmount),
        }),
      ),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.migrations.getMigrationTX(opts.input)
  })
