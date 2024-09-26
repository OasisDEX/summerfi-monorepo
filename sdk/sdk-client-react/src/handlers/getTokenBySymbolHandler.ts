import type { getChainHandler } from './getChainHandler'

export const getTokenBySymbolHandler =
  (getChain: ReturnType<typeof getChainHandler>) =>
  async ({ chainId, symbol }: { chainId: number; symbol: string }) => {
    const chain = await getChain({ chainId })
    const token = await chain.tokens.getTokenBySymbol({ symbol }).catch((error) => {
      throw new Error(`Failed to get token: ${error.message}`)
    })

    if (!token) {
      throw new Error(`SDK: Unsupport token: ${symbol}`)
    }

    return token
  }
