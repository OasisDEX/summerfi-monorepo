import { ConfigurationProvider } from '@summerfi/configuration-provider'
import { ConfigItem, ConfigKey } from '@summerfi/configuration-provider-common'
import { Maybe } from '@summerfi/sdk-common'

export class ConfigurationProviderMock extends ConfigurationProvider {
  readonly configItems: Map<ConfigKey, ConfigItem> = new Map<ConfigKey, ConfigItem>()

  setConfigurationItem(params: { name: ConfigKey; value: ConfigItem }): void {
    this.configItems.set(params.name, params.value)
  }

  getConfigurationItem<ReturnType = ConfigItem>(params: { name: ConfigKey }): Maybe<ReturnType> {
    const item = this.configItems.get(params.name)
    if (item) {
      return item as ReturnType
    }

    return super.getConfigurationItem(params)
  }
}
