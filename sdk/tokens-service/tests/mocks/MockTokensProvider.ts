import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import {
  Address,
  AddressType,
  ChainId,
  IAddress,
  IChainInfo,
  IToken,
  TokensProviderType,
  Token,
} from '@summerfi/sdk-common'
import { ManagerProviderBase } from '@summerfi/sdk-server-common'
import { ITokensProvider } from '@summerfi/tokens-common'

export class MockTokensProvider
  extends ManagerProviderBase<TokensProviderType>
  implements ITokensProvider
{
  type: TokensProviderType = TokensProviderType.Static

  constructor() {
    super({
      type: TokensProviderType.Static,
      configProvider: undefined as unknown as IConfigurationProvider,
    })
  }

  getSupportedChainIds(): ChainId[] {
    return [1, 4, 6]
  }

  getTokenBySymbol(params: { chainInfo: IChainInfo; symbol: string }): IToken {
    return Token.createFrom({
      name: 'MockToken',
      symbol: params.symbol,
      address: Address.createFrom({
        value: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        type: AddressType.Ethereum,
      }),
      chainInfo: params.chainInfo,
      decimals: 18,
    })
  }

  getTokenByAddress(params: { chainInfo: IChainInfo; address: IAddress }): IToken {
    return Token.createFrom({
      name: 'MockToken',
      symbol: 'MOCK',
      address: params.address,
      chainInfo: params.chainInfo,
      decimals: 18,
    })
  }

  getTokenByName(params: { chainInfo: IChainInfo; name: string }): IToken {
    return Token.createFrom({
      name: params.name,
      symbol: 'MOCK',
      address: Address.createFrom({
        value: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        type: AddressType.Ethereum,
      }),
      chainInfo: params.chainInfo,
      decimals: 18,
    })
  }
}
