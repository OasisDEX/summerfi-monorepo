import { Maybe } from '@summerfi/sdk-common/common'
import { IConfigurationProvider } from '../interfaces/IConfigurationProvider'
import { ConfigItem } from '../types/ConfigItem'
import { ConfigKey } from '../types/ConfigKey'

const CONFIG_KEYS: ConfigKey[] = [
  'ONE_INCH_API_KEY',
  'ONE_INCH_API_VERSION',
  'ONE_INCH_API_URL',
  'ONE_INCH_ALLOWED_SWAP_PROTOCOLS',
  'ONE_INCH_SWAP_CHAIN_IDS',
]

export class ConfigurationProvider implements IConfigurationProvider {
  private readonly _config: Record<ConfigKey, ConfigItem> = {}

  constructor() {
    this._loadConfigKeys(CONFIG_KEYS)
  }

  public getConfigurationItem(params: { name: ConfigKey }): Maybe<ConfigItem> {
    return this._config[params.name]
  }

  private _loadConfigKeys(configKeys: ConfigKey[]) {
    for (const key of configKeys) {
      this._config[key] = process.env[key] as ConfigItem
    }
  }
}
