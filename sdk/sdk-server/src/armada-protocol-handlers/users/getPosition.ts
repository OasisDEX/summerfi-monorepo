import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { type IArmadaPositionId, isArmadaPositionId } from '@summerfi/sdk-common'

export const getPosition = publicProcedure
  .input(
    z.object({
      positionId: z.custom<IArmadaPositionId>(isArmadaPositionId),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.utils.getPosition(opts.input)
  })
