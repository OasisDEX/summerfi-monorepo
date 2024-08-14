import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import {
  Address,
  AddressType,
  ChainId,
  IAddress,
  IChainInfo,
  IToken,
  Maybe,
  TokensProviderType,
} from '@summerfi/sdk-common'
import { Token } from '@summerfi/sdk-common/common'
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

  async getTokenBySymbol(params: {
    chainInfo: IChainInfo
    symbol: string
  }): Promise<Maybe<IToken>> {
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

  async getTokenByAddress(params: {
    chainInfo: IChainInfo
    address: IAddress
  }): Promise<Maybe<IToken>> {
    return Token.createFrom({
      name: 'MockToken',
      symbol: 'MOCK',
      address: params.address,
      chainInfo: params.chainInfo,
      decimals: 18,
    })
  }

  async getTokenByName(params: { chainInfo: IChainInfo; name: string }): Promise<Maybe<IToken>> {
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
