import {
  isArmadaVaultId,
  isRebalanceData,
  type IArmadaVaultId,
  type IRebalanceData,
} from '@summerfi/armada-protocol-common'

import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const adjustBuffer = publicProcedure
  .input(
    z.object({
      poolId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      rebalanceData: z.array(z.custom<IRebalanceData>(isRebalanceData)),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.adjustBuffer(opts.input)
  })
