import { ConfigItem, ConfigKey, ConfigurationProvider } from '@summerfi/configuration-provider'
import { Maybe } from '@summerfi/sdk-common'

export class ConfigurationProviderMock extends ConfigurationProvider {
  readonly configItems: Map<ConfigKey, ConfigItem> = new Map<ConfigKey, ConfigItem>()

  setConfigurationItem(params: { name: ConfigKey; value: ConfigItem }): void {
    this.configItems.set(params.name, params.value)
  }

  getConfigurationItem(params: { name: ConfigKey }): Maybe<ConfigItem> {
    const item = this.configItems.get(params.name)
    if (item) {
      return item
    }

    return super.getConfigurationItem(params)
  }
}
