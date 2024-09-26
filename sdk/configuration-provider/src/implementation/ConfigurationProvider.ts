import {
  ConfigItem,
  ConfigKey,
  IConfigurationProvider,
} from '@summerfi/configuration-provider-common'
import TurboConfig from '../../../../turbo.json'

/** @see IConfigurationProvider */
export class ConfigurationProvider implements IConfigurationProvider {
  private readonly _config: Record<ConfigKey, ConfigItem> = {}

  constructor() {
    this._loadConfigKeys(TurboConfig.globalEnv)
  }

  public getConfigurationItem<ReturnType = ConfigItem>(params: { name: ConfigKey }): ReturnType {
    if (!this._config[params.name]) {
      throw new Error(`Missing env variable: ${params.name}. Please add it to stack configuration.`)
    }
    return this._config[params.name] as ReturnType
  }

  private _loadConfigKeys(configKeys: ConfigKey[]) {
    for (const key of configKeys) {
      this._config[key] = process.env[key] as ConfigItem
    }
  }
}
