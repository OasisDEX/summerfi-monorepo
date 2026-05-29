import {
  isAddress,
  isArmadaVaultId,
  isUser,
  RoundsVaultType,
  type IAddress,
  type IArmadaVaultId,
  type IUser,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getCancelRoundDepositTx = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      user: z.custom<IUser>(isUser),
      roundId: z.bigint(),
      amount: z.bigint(),
      receiver: z.custom<IAddress>(isAddress).optional(),
      vaultType: z.nativeEnum(RoundsVaultType),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.rwa.getCancelRoundDepositTx(opts.input)
  })
