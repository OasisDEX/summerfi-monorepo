import { ConfigItem, ConfigKey, IConfigurationProvider } from '@summerfi/configuration-provider'
import { Maybe } from '@summerfi/sdk-common'

export class ConfigurationProviderMock implements IConfigurationProvider {
  readonly configItems: Map<ConfigKey, ConfigItem> = new Map<ConfigKey, ConfigItem>()

  setConfigurationItem(params: { name: ConfigKey; value: ConfigItem }): void {
    this.configItems.set(params.name, params.value)
  }

  getConfigurationItem(params: { name: ConfigKey }): Maybe<ConfigItem> {
    return this.configItems.get(params.name)
  }
}
