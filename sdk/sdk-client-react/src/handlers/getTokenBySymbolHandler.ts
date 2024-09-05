import { type ISDKManager } from '@summerfi/sdk-client'

export const getTokenBySymbolHandler =
  (sdk: ISDKManager) =>
  async ({ chainId, symbol }: { chainId: number; symbol: string }) => {
    const chain = await sdk.chains.getChainById({
      chainId,
    })

    if (!chain) {
      throw new Error('Chain not found')
    }

    const token = await chain.tokens.getTokenBySymbol({ symbol }).catch((error) => {
      throw new Error(`Failed to get token: ${error.message}`)
    })

    if (!token) {
      throw new Error(`SDK: Unsupport token: ${symbol}`)
    }

    return token
  }
