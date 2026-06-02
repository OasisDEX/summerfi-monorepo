import { isAddressValue, isChainId, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getDepositTx = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      fleetAddress: z.custom<AddressValue>(isAddressValue),
      userAddress: z.custom<AddressValue>(isAddressValue),
      assetsAmount: z.string(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.rwaManager.getDepositTx(opts.input)
  })
