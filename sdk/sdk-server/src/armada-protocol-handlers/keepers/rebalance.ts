import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isRebalanceData, type IRebalanceData } from '@summerfi/contracts-provider-common'
import { type IArmadaVaultId, isArmadaVaultId } from '@summerfi/sdk-common'

export const rebalance = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      rebalanceData: z.array(z.custom<IRebalanceData>(isRebalanceData)),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.rebalance(opts.input)
  })
