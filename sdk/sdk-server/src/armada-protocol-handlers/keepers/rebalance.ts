import {
  isArmadaPoolId,
  isRebalanceData,
  type IArmadaPoolId,
  type IRebalanceData,
} from '@summerfi/armada-protocol-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const rebalance = publicProcedure
  .input(
    z.object({
      poolId: z.custom<IArmadaPoolId>(isArmadaPoolId),
      rebalanceData: z.array(z.custom<IRebalanceData>(isRebalanceData)),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.rebalance(opts.input)
  })
