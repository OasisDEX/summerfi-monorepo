import {
  AddressValue,
  IUser,
  isArmadaVaultId,
  isPercentage,
  isUser,
  type IArmadaVaultId,
  type IPercentage,
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
      positionIds: z.array(z.custom<AddressValue>((val) => isHex(val))),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.migrations.getMigrationTX(opts.input)
  })
