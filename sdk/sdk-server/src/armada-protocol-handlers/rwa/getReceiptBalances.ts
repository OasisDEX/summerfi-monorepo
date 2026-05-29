import { isAddress, isArmadaVaultId, RoundsVaultType, type IAddress, type IArmadaVaultId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getReceiptBalances = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      account: z.custom<IAddress>(isAddress),
      vaultType: z.nativeEnum(RoundsVaultType),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.rwa.getReceiptBalances(opts.input)
  })
