import { isArmadaPoolId, type IArmadaPoolId } from '@summerfi/armada-protocol-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getPoolInfo = publicProcedure
  .input(
    z.object({
      poolId: z.custom<IArmadaPoolId>(isArmadaPoolId),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.getPoolInfo(opts.input)
  })
