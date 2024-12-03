import { IArmadaVaultId, isArmadaVaultId } from '@summerfi/armada-protocol-common'
import { ITokenAmount, isTokenAmount } from '@summerfi/sdk-common'
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
    return opts.ctx.armadaManager.setFleetDepositCap(opts.input)
  })
