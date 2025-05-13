import { ConfigurationProviderMock } from '@summerfi/configuration-provider-mock'
import { TestManagerProvider, TestProviderType } from './mocks/TestManagerProvider'

describe('SDK Server Common | Unit | ManagerProviderBase', () => {
  let testManagerProvider: TestManagerProvider
  let configurationProviderMock: ConfigurationProviderMock

  beforeAll(async () => {
    configurationProviderMock = new ConfigurationProviderMock()

    testManagerProvider = new TestManagerProvider({
      type: TestProviderType.TestProvider,
      configProvider: configurationProviderMock,
      supportedChainIds: [1],
    })

    configurationProviderMock.setConfigurationItem({ name: 'testKey', value: 'testValue' })
  })

  it('should store the provider type', () => {
    expect(testManagerProvider.type).toBe(TestProviderType.TestProvider)
  })

  it('should store the configuration provider', () => {
    expect(testManagerProvider.configProvider).toBeInstanceOf(ConfigurationProviderMock)
    expect(testManagerProvider.configProvider.getConfigurationItem({ name: 'testKey' })).toBe(
      'testValue',
    )
  })

  it('should store the supported chain ids', () => {
    expect(testManagerProvider.supportedChainIds).toEqual([1])
  })
})
