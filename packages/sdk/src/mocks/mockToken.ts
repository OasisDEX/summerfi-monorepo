import { ChainInfo } from '~sdk/chains'
import { Address, Token } from '~sdk/common'
import { Maybe } from '~sdk/utils'

export async function getMockTokenBySymbol(params: {
  chainInfo: ChainInfo
  symbol: string
}): Promise<Maybe<Token>> {
  switch (params.symbol) {
    case 'DAI':
      return Token.createFrom({
        chainInfo: params.chainInfo,
        address: Address.createFrom({ hexValue: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
        symbol: params.symbol,
        name: 'Dai Stablecoin',
        decimals: 18,
      })
    case 'WETH':
      return Token.createFrom({
        chainInfo: params.chainInfo,
        address: Address.createFrom({ hexValue: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
        symbol: params.symbol,
        name: 'Wrapped Ether',
        decimals: 18,
      })
  }
}
