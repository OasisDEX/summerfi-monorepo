import { isArmadaPoolId, type IArmadaPoolId } from '@summerfi/armada-protocol-common'
import { isAddress, type IAddress } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const addArks = publicProcedure
  .input(
    z.object({
      poolId: z.custom<IArmadaPoolId>(isArmadaPoolId),
      arks: z.array(z.custom<IAddress>(isAddress)),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.addArks(opts.input)
  })