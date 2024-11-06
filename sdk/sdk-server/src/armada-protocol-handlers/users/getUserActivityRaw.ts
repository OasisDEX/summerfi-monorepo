import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { IArmadaVaultId, isArmadaVaultId } from '@summerfi/armada-protocol-common'

export const getUserActivityRaw = publicProcedure
  .input(
    z.object({
      poolId: z.custom<IArmadaVaultId>(isArmadaVaultId),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.getUserActivityRaw(opts.input)
  })
