import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'
import { isAddressValue, isChainId, type AddressValue, type ChainId } from '@summerfi/sdk-common'

export const allowanceGetPermit2Data = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      tokenAddress: z.custom<AddressValue>(isAddressValue),
      amount: z.bigint().nonnegative({ message: 'amount must be non-negative' }),
      spenderAddress: z.custom<AddressValue>(isAddressValue),
      senderAddress: z.custom<AddressValue>(isAddressValue),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.allowanceManager.getPermit2Data(opts.input)
  })
