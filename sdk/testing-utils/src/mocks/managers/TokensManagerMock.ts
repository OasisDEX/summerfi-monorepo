import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { TokensManager, StaticTokensProvider } from '@summerfi/tokens-service'

export class TokensManagerMock extends TokensManager {
  constructor() {
    super({
      providers: [
        new StaticTokensProvider({
          configProvider: {} as IConfigurationProvider,
          blockchainClientProvider: {} as IBlockchainClientProvider,
        }),
      ],
    })
  }
}
