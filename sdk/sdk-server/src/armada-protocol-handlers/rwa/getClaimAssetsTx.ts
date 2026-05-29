import {
  isAddress,
  isArmadaVaultId,
  isUser,
  type IAddress,
  type IArmadaVaultId,
  type IUser,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getClaimAssetsTx = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      user: z.custom<IUser>(isUser),
      roundId: z.bigint(),
      amount: z.bigint(),
      receiver: z.custom<IAddress>(isAddress).optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.rwa.getClaimAssetsTx(opts.input)
  })
