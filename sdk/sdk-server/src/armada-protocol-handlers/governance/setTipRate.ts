import { IArmadaVaultId, isArmadaVaultId } from '@summerfi/armada-protocol-common'
import { IPercentage, isPercentage } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const setTipRate = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      rate: z.custom<IPercentage>(isPercentage),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.setTipRate(opts.input)
  })
