import { publicProcedure } from '../TRPC'
import { Address, AddressSchema, ChainInfo, ChainInfoSchema, Maybe } from '@summerfi/sdk-common'
import { Token } from '@summerfi/sdk-common/common'
import { z } from 'zod'

export const getTokenByAddress = publicProcedure
  .input(
    z.object({
      chainInfo: ChainInfoSchema,
      address: AddressSchema,
    }),
  )
  .query(async (opts): Promise<Maybe<Token>> => {
    return opts.ctx.tokensManager.getTokenByAddress({
      chainInfo: ChainInfo.createFrom(opts.input.chainInfo),
      address: Address.createFrom(opts.input.address),
    })
  })
