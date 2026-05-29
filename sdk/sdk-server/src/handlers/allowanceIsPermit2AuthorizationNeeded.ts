import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'
import {
  Address,
  isAddressValue,
  isChainId,
  type AddressValue,
  type ChainId,
} from '@summerfi/sdk-common'

export const allowanceIsPermit2AuthorizationNeeded = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      ownerAddress: z.custom<AddressValue>(isAddressValue),
      tokenAddress: z.custom<AddressValue>(isAddressValue),
      amount: z.bigint().nonnegative({ message: 'amount must be non-negative' }),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.allowanceManager.isPermit2AuthorizationNeeded({
      chainId: opts.input.chainId,
      ownerAddress: Address.createFromEthereum({ value: opts.input.ownerAddress }),
      tokenAddress: Address.createFromEthereum({ value: opts.input.tokenAddress }),
      amount: opts.input.amount,
    })
  })
