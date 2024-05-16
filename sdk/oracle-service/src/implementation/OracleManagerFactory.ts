import { type IConfigurationProvider } from '@summerfi/configuration-provider'
import { OneInchOracleProvider } from './oneinch/OneInchOracleProvider'
import { OracleManager } from './OracleManager'

/**
 * @name OracleManagerFactory
 * @description This class is responsible for creating instances of the OracleManager
 */
export class OracleManagerFactory {
  public static newOracleManager(params: {
    configProvider: IConfigurationProvider
  }): OracleManager {
    return new OracleManager({
      providers: [new OneInchOracleProvider(params)],
    })
  }
}
