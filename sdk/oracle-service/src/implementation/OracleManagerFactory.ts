import { type IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { OracleManager } from './OracleManager'
import { OneInchOracleProvider } from './oneinch/OneInchOracleProvider'
import { CoingeckoOracleProvider } from './coingecko/CoingeckoOracleProvider'

/**
 * @name OracleManagerFactory
 * @description This class is responsible for creating instances of the OracleManager
 */
export class OracleManagerFactory {
  public static newOracleManager(params: {
    configProvider: IConfigurationProvider
  }): OracleManager {
    return new OracleManager({
      providers: [new OneInchOracleProvider(params), new CoingeckoOracleProvider(params)],
    })
  }
}
