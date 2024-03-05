import { TokenAmount } from '@summerfi/sdk-common/common'
import type { GetQuote } from '@summerfi/simulator-service'
import { publicProcedure } from '~src/trpc'

export const providerProcedure = publicProcedure.use(async (opts) => {
  const getQuoteMock: GetQuote = async ({ fromTokenAmount, fee, slippage, toToken }) => {
    return {
      fee,
      slippage,
      fromTokenAmount,
      toTokenAmount: TokenAmount.createFrom({ amount: '10000000', token: toToken }),
    }
  }
  return opts.next({
    ctx: {
      getQuote: getQuoteMock,
    },
  })
})
