import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { type IArmadaPositionId, isArmadaPositionId } from '@summerfi/sdk-common'

/**
 * @name getPositionHistory
 * @description tRPC handler to retrieve position history snapshots
 */
export const getPositionHistory = publicProcedure
  .input(
    z.object({
      positionId: z.custom<IArmadaPositionId>(isArmadaPositionId),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.utils.getPositionHistory(opts.input)
  })
