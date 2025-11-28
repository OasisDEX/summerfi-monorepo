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
      first: z.number().optional(),
      skip: z.number().optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.utils.getWithdrawals(opts.input)
  })
