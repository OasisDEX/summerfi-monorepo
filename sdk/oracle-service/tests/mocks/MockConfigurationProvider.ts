import {
  ConfigItem,
  ConfigKey,
  IConfigurationProvider,
} from '@summerfi/configuration-provider-common'

export class MockConfigurationProvider implements IConfigurationProvider {
  getConfigurationItem(params: { name: ConfigKey }): ConfigItem {
    switch (params.name) {
      case 'ONE_INCH_API_SPOT_VERSION':
        return 'v3.0'
      case 'ONE_INCH_API_SPOT_KEY':
        return 'key'
      case 'ONE_INCH_API_SPOT_URL':
        return 'https://someapi.com'
      case 'ONE_INCH_API_SPOT_AUTH_HEADER':
        return 'Authorization'
      case 'ONE_INCH_API_SPOT_CHAIN_IDS':
        return '1'
      case 'COINGECKO_API_URL':
        return 'https://api.coingecko.com/api/v3'
      case 'COINGECKO_API_VERSION':
        return 'v3'
      case 'COINGECKO_API_KEY':
        return 'key'
      case 'COINGECKO_API_AUTH_HEADER':
        return 'Authorization'
      case 'COINGECKO_SUPPORTED_CHAIN_IDS':
        return '1'
      default:
        throw new Error(`Configuration item ${params.name} not found`)
    }
  }
}
