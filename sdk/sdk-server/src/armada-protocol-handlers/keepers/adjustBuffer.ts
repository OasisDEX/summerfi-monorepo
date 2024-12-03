import { isArmadaVaultId, type IArmadaVaultId } from '@summerfi/armada-protocol-common'

import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isRebalanceData, type IRebalanceData } from '@summerfi/contracts-provider-common'

export const adjustBuffer = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      rebalanceData: z.array(z.custom<IRebalanceData>(isRebalanceData)),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.adjustBuffer(opts.input)
  })
