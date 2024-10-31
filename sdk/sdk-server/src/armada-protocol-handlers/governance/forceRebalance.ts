import { isArmadaVaultId, type IArmadaVaultId } from '@summerfi/armada-protocol-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isRebalanceData, type IRebalanceData } from '@summerfi/contracts-provider-common'

export const forceRebalance = publicProcedure
  .input(
    z.object({
      poolId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      rebalanceData: z.array(z.custom<IRebalanceData>(isRebalanceData)),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.forceRebalance(opts.input)
  })
