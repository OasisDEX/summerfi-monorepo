import {
  IAddress,
  ITokenAmount,
  isAddress,
  isArmadaVaultId,
  isTokenAmount,
  type IArmadaVaultId,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const setArkMaxRebalanceInflow = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      ark: z.custom<IAddress>(isAddress),
      maxRebalanceInflow: z.custom<ITokenAmount>(isTokenAmount),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.setArkMaxRebalanceInflow(opts.input)
  })
