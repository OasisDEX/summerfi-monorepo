import {
  IArmadaRebalanceData,
  isArmadaPoolId,
  isArmadaRebalanceData,
  type IArmadaPoolId,
} from '@summerfi/armada-protocol-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const rebalance = publicProcedure
  .input(
    z.object({
      poolId: z.custom<IArmadaPoolId>(isArmadaPoolId),
      rebalanceData: z.array(z.custom<IArmadaRebalanceData>(isArmadaRebalanceData)),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.rebalance(opts.input)
  })
