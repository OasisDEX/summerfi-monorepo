import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'
import {
  Address,
  isAddressValue,
  isChainId,
  type AddressValue,
  type ChainId,
} from '@summerfi/sdk-common'

export const allowanceGetPermit2AuthorizationTx = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      tokenAddress: z.custom<AddressValue>(isAddressValue),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.allowanceManager.getPermit2AuthorizationTx({
      chainId: opts.input.chainId,
      tokenAddress: Address.createFromEthereum({ value: opts.input.tokenAddress }),
    })
  })
