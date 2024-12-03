import { isArmadaPositionId, type IArmadaPositionId } from '@summerfi/armada-protocol-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getPosition = publicProcedure
  .input(
    z.object({
      positionId: z.custom<IArmadaPositionId>(isArmadaPositionId),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.getPosition(opts.input)
  })
