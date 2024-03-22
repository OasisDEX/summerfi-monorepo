import { TokenSymbol, Address, Token } from '@summerfi/sdk-common/common'

export interface ITokenService {
  getTokenByAddress: (address: Address) => Promise<Token>
  getTokenBySymbol: (symbol: TokenSymbol) => Promise<Token>
}
