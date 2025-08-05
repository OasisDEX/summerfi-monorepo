import {
  ITokenAmount,
  isArmadaVaultId,
  isTokenAmount,
  type IArmadaVaultId,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const setFleetDepositCap = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      cap: z.custom<ITokenAmount>(isTokenAmount),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.admin.setFleetDepositCap(opts.input)
  })
