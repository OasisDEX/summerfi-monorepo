import { IArmadaPoolId, isArmadaPoolId } from '@summerfi/armada-protocol-common'
import { IAddress, isAddress } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const addArk = publicProcedure
  .input(
    z.object({
      poolId: z.custom<IArmadaPoolId>(isArmadaPoolId),
      ark: z.custom<IAddress>(isAddress),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.addArk(opts.input)
  })