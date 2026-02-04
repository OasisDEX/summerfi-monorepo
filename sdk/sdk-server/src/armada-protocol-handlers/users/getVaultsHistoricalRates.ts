import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { AddressValue, isAddressValue, isChainId, type ChainId } from '@summerfi/sdk-common'

export const getVaultsHistoricalRates = publicProcedure
  .input(
    z.object({
      fleets: z.array(
        z.object({
          fleetAddress: z.custom<AddressValue>(isAddressValue),
          chainId: z.custom<ChainId>(isChainId),
        }),
      ),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.positions.getVaultsHistoricalRates(opts.input)
  })
