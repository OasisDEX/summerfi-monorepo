import { publicProcedure } from '../TRPC'
import {
  Address,
  AddressDataSchema,
  ChainInfo,
  ChainInfoDataSchema,
  Maybe,
} from '@summerfi/sdk-common'
import { Token } from '@summerfi/sdk-common/common'
import { z } from 'zod'

export const getTokenByAddress = publicProcedure
  .input(
    z.object({
      chainInfo: ChainInfoDataSchema,
      address: AddressDataSchema,
    }),
  )
  .query(async (opts): Promise<Maybe<Token>> => {
    return opts.ctx.tokensManager.getTokenByAddress({
      chainInfo: ChainInfo.createFrom(opts.input.chainInfo),
      address: Address.createFrom(opts.input.address),
    })
  })
