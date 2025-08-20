import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { ChainId } from '@summerfi/sdk-common'
import { ManagerProviderBase } from '../../src'

export enum TestProviderType {
  MainnetProvider = 'TestProvider',
  ArbitrumProvider = 'OtherTestProvider',
}

export class TestManagerProvider extends ManagerProviderBase<TestProviderType> {
  readonly supportedChainIds: ChainId[]

  constructor(params: {
    type: TestProviderType
    configProvider: IConfigurationProvider
    supportedChainIds: ChainId[]
  }) {
    super(params)

    this.supportedChainIds = params.supportedChainIds
  }

  getSupportedChainIds() {
    return this.supportedChainIds
  }
}
