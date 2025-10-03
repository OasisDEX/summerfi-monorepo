import {
  isAddress,
  isTokenAmount,
  isChainId,
  type IAddress,
  type ITokenAmount,
  type ChainId,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getErc20TokenTransferTx = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      tokenAddress: z.custom<IAddress>(isAddress),
      recipientAddress: z.custom<IAddress>(isAddress),
      amount: z.custom<ITokenAmount>(isTokenAmount),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.utils.getErc20TokenTransferTx(opts.input)
  })
