import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import { ChainInfo, Token, TokenAmount, Address, Percentage } from '@summerfi/sdk-common/common'
import { SwapData } from '@summerfi/swap-common/types'

export const getSwapData = publicProcedure
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
    return await opts.ctx.swapService.getSwapData({
      chainInfo: opts.input.chainInfo,
      fromAmount: opts.input.fromAmount,
      toToken: opts.input.toToken,
      recipient: opts.input.recipient,
      slippage: opts.input.slippage,
    })
  })
