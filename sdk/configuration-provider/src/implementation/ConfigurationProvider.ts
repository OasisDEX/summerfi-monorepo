import { Maybe } from '@summerfi/sdk-common/common'
import TurboConfig from '../../../../turbo.json'
import { IConfigurationProvider } from '../interfaces/IConfigurationProvider'
import { ConfigItem } from '../types/ConfigItem'
import { ConfigKey } from '../types/ConfigKey'

export class ConfigurationProvider implements IConfigurationProvider {
  private readonly _config: Record<ConfigKey, ConfigItem> = {}

  constructor() {
    this._loadConfigKeys(TurboConfig.globalEnv)
  }

  public getConfigurationItem<ReturnType = ConfigItem>(params: {
    name: ConfigKey
  }): Maybe<ReturnType> {
    return this._config[params.name] as Maybe<ReturnType>
  }

  private _loadConfigKeys(configKeys: ConfigKey[]) {
    for (const key of configKeys) {
      this._config[key] = process.env[key] as ConfigItem
    }
  }
}
