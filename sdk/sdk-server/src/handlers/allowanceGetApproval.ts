import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'
import {
  Address,
  getChainInfoByChainId,
  isAddressValue,
  isChainId,
  isTokenAmount,
  type AddressValue,
  type ChainId,
  type ITokenAmount,
} from '@summerfi/sdk-common'

export const allowanceGetApproval = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      spender: z.custom<AddressValue>(isAddressValue),
      amount: z.custom<ITokenAmount>(isTokenAmount),
      owner: z.custom<AddressValue>(isAddressValue).optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.allowanceManager.getApproval({
      chainInfo: getChainInfoByChainId(opts.input.chainId),
      spender: Address.createFromEthereum({ value: opts.input.spender }),
      amount: opts.input.amount,
      owner: opts.input.owner ? Address.createFromEthereum({ value: opts.input.owner }) : undefined,
    })
  })
