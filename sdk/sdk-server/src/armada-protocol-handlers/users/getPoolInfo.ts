import { isArmadaVaultId, type IArmadaVaultId } from '@summerfi/armada-protocol-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getPoolInfo = publicProcedure
  .input(
    z.object({
      poolId: z.custom<IArmadaVaultId>(isArmadaVaultId),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.getVaultInfo(opts.input)
  })
