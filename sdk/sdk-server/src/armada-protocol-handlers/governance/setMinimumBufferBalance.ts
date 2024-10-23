import { isArmadaVaultId, type IArmadaVaultId } from '@summerfi/armada-protocol-common'
import { ITokenAmount, isTokenAmount } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const setMinimumBufferBalance = publicProcedure
  .input(
    z.object({
      poolId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      minimumBufferBalance: z.custom<ITokenAmount>(isTokenAmount),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.setMinimumBufferBalance(opts.input)
  })
