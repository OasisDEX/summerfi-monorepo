import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import {
  type IArmadaVaultId,
  isArmadaVaultId,
  isRebalanceData,
  type IRebalanceData,
} from '@summerfi/sdk-common'

export const forceRebalance = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      rebalanceData: z.array(z.custom<IRebalanceData>(isRebalanceData)),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.admin.forceRebalance(opts.input)
  })
