import { ConfigItem } from '../types/ConfigItem'
import { ConfigKey } from '../types/ConfigKey'

/**
 * @name IConfigurationProvider
 * @description Interface for the configuration provider, which is used to retrieve configuration items which are
 *              typically stored in environment variables, although it could also fetch them from other sources
 */
export interface IConfigurationProvider {
  /**
   * @name getConfigurationItem
   * @description Retrieves a configuration item from the configuration provider
   * @param name The name of the configuration item to retrieve
   * @returns The value of the configuration item
   * @throws If the configuration item is not found or is invalid
   */
  getConfigurationItem(params: { name: ConfigKey }): ConfigItem
}
