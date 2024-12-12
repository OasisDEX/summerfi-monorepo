import { ConfigurationProvider } from '../src/implementation/ConfigurationProvider'

describe('Configuration Provider', () => {
  it('should return config values', () => {
    const configProvider = new ConfigurationProvider()

    const apiKey = configProvider.getConfigurationItem({ name: 'ONE_INCH_API_KEY' })
    const apiVersion = configProvider.getConfigurationItem({ name: 'ONE_INCH_API_VERSION' })
    const apiUrl = configProvider.getConfigurationItem({ name: 'ONE_INCH_API_URL' })
    const swapChainIds = configProvider.getConfigurationItem({ name: 'ONE_INCH_SWAP_CHAIN_IDS' })

    expect(apiKey).toBeDefined()
    expect(apiVersion).toBeDefined()
    expect(apiUrl).toBeDefined()
    expect(swapChainIds).toBeDefined()
  })
})
