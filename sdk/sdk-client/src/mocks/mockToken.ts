import { Address, ChainInfo, Maybe, Token, TokenSymbol } from '@summerfi/sdk-common/common'

export async function getMockTokenBySymbol(params: {
  chainInfo: ChainInfo
  symbol: TokenSymbol
}): Promise<Maybe<Token>> {

  if (params.chainInfo.chainId !== 1) {
    throw new Error('This mock provides data only for ethereum mainnet')
  }

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
    case TokenSymbol.WSTETH:
      return Token.createFrom({
        chainInfo: params.chainInfo,
        address: Address.createFromEthereum({
          value: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
        }),
        symbol: params.symbol,
        name: 'Wrapped liquid staked Ether 2.0',
        decimals: 18,
      })
    case TokenSymbol.RETH:
      return Token.createFrom({
        chainInfo: params.chainInfo,
        address: Address.createFromEthereum({
          value: '0xae78736cd615f374d3085123a210448e74fc6393',
        }),
        symbol: params.symbol,
        name: 'Rocket Pool ETH',
        decimals: 18,
      })
    case TokenSymbol.SDAI:
      return Token.createFrom({
        chainInfo: params.chainInfo,
        address: Address.createFromEthereum({
          value: '0x83f20f44975d03b1b09e64809b757c47f942beea',
        }),
        symbol: params.symbol,
        name: 'Savings Dai',
        decimals: 18,
      })
    case TokenSymbol.USDC:
      return Token.createFrom({
        chainInfo: params.chainInfo,
        address: Address.createFromEthereum({
          value: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        }),
        symbol: params.symbol,
        name: 'USD Coin',
        decimals: 6,
      })
    case TokenSymbol.USDT:
      return Token.createFrom({
        chainInfo: params.chainInfo,
        address: Address.createFromEthereum({
          value: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        }),
        symbol: params.symbol,
        name: 'Tether USD',
        decimals: 6,
      })
    case TokenSymbol.WBTC:
      return Token.createFrom({
        chainInfo: params.chainInfo,
        address: Address.createFromEthereum({
          value: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        }),
        symbol: params.symbol,
        name: 'Wrapped BTC',
        decimals: 8,
      })
  }
}
