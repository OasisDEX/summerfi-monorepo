import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { type IArmadaPositionId, isArmadaPositionId } from '@summerfi/sdk-common'

/**
 * @name getDeposits
 * @description tRPC handler to retrieve deposits for a given Armada position ID
 */
export const getDeposits = publicProcedure
  .input(
    z.object({
      positionId: z.custom<IArmadaPositionId>(isArmadaPositionId),
      first: z.number().int().min(1).max(1000).optional(),
      skip: z.number().int().min(0).optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.positions.getDeposits(opts.input)
  })
