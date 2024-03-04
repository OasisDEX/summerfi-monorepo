import { TokenSymbol } from '~sdk-common/common/enums'

import type { Maybe } from '~sdk-common/common/aliases'
import type { ChainInfo } from '~sdk-common/common/implementation/ChainInfo'
import { Token } from '~sdk-common/common/implementation/Token'
import { Address } from '~sdk-common/common/implementation/Address'

export async function getMockTokenBySymbol(params: {
  chainInfo: ChainInfo
  symbol: TokenSymbol
}): Promise<Maybe<Token>> {
  switch (params.symbol) {
    case TokenSymbol.DAI:
      return Token.createFrom({
        chainInfo: params.chainInfo,
        address: Address.createFrom({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
        symbol: params.symbol,
        name: 'Dai Stablecoin',
        decimals: 18,
      })
    case TokenSymbol.WETH:
      return Token.createFrom({
        chainInfo: params.chainInfo,
        address: Address.createFrom({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
        symbol: params.symbol,
        name: 'Wrapped Ether',
        decimals: 18,
      })
  }
}
