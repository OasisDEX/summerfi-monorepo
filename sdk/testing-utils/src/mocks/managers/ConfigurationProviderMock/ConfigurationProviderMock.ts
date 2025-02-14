import { ConfigurationProvider } from '@summerfi/configuration-provider'
import { ConfigItem, ConfigKey } from '@summerfi/configuration-provider-common'

export class ConfigurationProviderMock extends ConfigurationProvider {
  readonly configItems: Map<ConfigKey, ConfigItem> = new Map<ConfigKey, ConfigItem>()

  setConfigurationItem(params: { name: ConfigKey; value: ConfigItem }): void {
    this.configItems.set(params.name, params.value)
  }

  getConfigurationItem<ReturnType = ConfigItem>(params: { name: ConfigKey }): ReturnType {
    const item = this.configItems.get(params.name)
    if (item) {
      return item as ReturnType
    }

    return super.getConfigurationItem(params)
  }
}
