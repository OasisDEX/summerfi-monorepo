import { ConfigurationProvider } from '@summerfi/configuration-provider'
import { TokensManager, StaticTokensProvider } from '@summerfi/tokens-service'

export class TokensManagerMock extends TokensManager {
  constructor() {
    super({
      providers: [new StaticTokensProvider({ configProvider: {} as ConfigurationProvider })],
    })
  }
}
