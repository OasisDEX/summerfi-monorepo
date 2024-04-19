import { Address, ChainInfo, Maybe, Token, TokenSymbol } from '@summerfi/sdk-common/common'

export async function getMockTokenBySymbol(params: {
  chainInfo: ChainInfo
  symbol: TokenSymbol
}): Promise<Maybe<Token>> {
  switch (params.symbol) {
    case TokenSymbol.DAI:
      return Token.createFrom({
        chainInfo: params.chainInfo,
        address: Address.createFromEthereum({
          value: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        }),
        symbol: params.symbol,
        name: 'Dai Stablecoin',
        decimals: 18,
      })
    case TokenSymbol.WETH:
      return Token.createFrom({
        chainInfo: params.chainInfo,
        address: Address.createFromEthereum({
          value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        }),
        symbol: params.symbol,
        name: 'Wrapped Ether',
        decimals: 18,
      })
    case TokenSymbol.USDC:
      return Token.createFrom({
        chainInfo: params.chainInfo,
        address: Address.createFromEthereum({
          value: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        }),
        symbol: params.symbol,
        name: 'USD Coin',
        decimals: 6,
      })
    case TokenSymbol.WBTC:
      return Token.createFrom({
        chainInfo: params.chainInfo,
        address: Address.createFromEthereum({
          value: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        }),
        symbol: params.symbol,
        name: 'Wrapped Bitcoin',
        decimals: 8,
      })
  }
}
