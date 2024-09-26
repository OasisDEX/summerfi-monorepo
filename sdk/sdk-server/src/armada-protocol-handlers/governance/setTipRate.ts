import { IArmadaPoolId, isArmadaPoolId } from '@summerfi/armada-protocol-common'
import { IPercentage, isPercentage } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const setTipRate = publicProcedure
  .input(
    z.object({
      poolId: z.custom<IArmadaPoolId>(isArmadaPoolId),
      rate: z.custom<IPercentage>(isPercentage),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.setTipRate(opts.input)
  })
