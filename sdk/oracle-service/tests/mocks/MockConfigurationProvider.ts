import {
  ConfigItem,
  ConfigKey,
  IConfigurationProvider,
} from '@summerfi/configuration-provider-common'
import { Maybe } from '@summerfi/sdk-common'

export class MockConfigurationProvider implements IConfigurationProvider {
  getConfigurationItem(params: { name: ConfigKey }): Maybe<ConfigItem> {
    switch (params.name) {
      case 'ONE_INCH_API_SPOT_VERSION':
        return 'v3.0'
      case 'ONE_INCH_API_SPOT_KEY':
        return 'key'
      case 'ONE_INCH_API_SPOT_URL':
        return 'https://someapi.com'
    }
  }
}
