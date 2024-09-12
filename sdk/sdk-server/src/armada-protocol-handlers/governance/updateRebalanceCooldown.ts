import { IArmadaPoolId, isArmadaPoolId } from '@summerfi/armada-protocol-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const updateRebalanceCooldown = publicProcedure
  .input(
    z.object({
      poolId: z.custom<IArmadaPoolId>(isArmadaPoolId),
      cooldown: z.number(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.updateRebalanceCooldown(opts.input)
  })
