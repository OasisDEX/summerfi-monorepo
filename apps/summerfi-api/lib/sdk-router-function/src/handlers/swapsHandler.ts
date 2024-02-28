import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import {
  ChainInfo,
  Token,
  TokenAmount,
  Address,
  Percentage,
} from '@summerfi/sdk-common/common/implementation'
import { SwapService } from '@summerfi/swap-service'
import { SwapData } from '@summerfi/swap-common/types'

export const swapsHandler = publicProcedure
  .input(
    z.object({
      chainInfo: z.custom<ChainInfo>((chainInfo) => chainInfo !== undefined),
      fromAmount: z.custom<TokenAmount>((tokenAmount) => tokenAmount !== undefined),
      toToken: z.custom<Token>((token) => token !== undefined),
      recipient: z.custom<Address>((recipient) => recipient !== undefined),
      slippage: z.custom<Percentage>((slippage) => slippage !== undefined),
    }),
  )
  .query(async (opts): Promise<SwapData> => {
    if (!opts.ctx.deployments) {
      throw new Error('Deployments dependency not resolved correctly')
    }

    const swapService = new SwapService()

    return await swapService.getSwapData({
      chainInfo: opts.input.chainInfo,
      fromAmount: opts.input.fromAmount,
      toToken: opts.input.toToken,
      recipient: opts.input.recipient,
      slippage: opts.input.slippage,
    })
  })
