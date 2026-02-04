import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { type IArmadaPositionId, isArmadaPositionId } from '@summerfi/sdk-common'

/**
 * @name getWithdrawals
 * @description tRPC handler to retrieve withdrawals for a given Armada position ID
 */
export const getWithdrawals = publicProcedure
  .input(
    z.object({
      positionId: z.custom<IArmadaPositionId>(isArmadaPositionId),
      // constrain pagination parameters to safe ranges to avoid heavy or invalid queries
      first: z.number().int().min(1).max(1000).optional(),
      skip: z.number().int().min(0).optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.positions.getWithdrawals(opts.input)
  })
