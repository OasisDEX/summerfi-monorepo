import { IArmadaPoolId, isArmadaPoolId } from '@summerfi/armada-protocol-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getPool = publicProcedure
  .input(
    z.object({
      poolId: z.custom<IArmadaPoolId>(isArmadaPoolId),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.getPool(opts.input)
  })
