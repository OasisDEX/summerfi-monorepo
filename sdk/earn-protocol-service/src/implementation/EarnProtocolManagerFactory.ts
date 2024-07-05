import { EarnProtocolManager } from './EarnProtocolManager'

/**
 * @name EarnProtocolManagerFactory
 * @description This class is responsible for creating instances of the OracleManager
 */
export class EarnProtocolManagerFactory {
  public static newEarnProtocolManager(params: {}): EarnProtocolManager {
    return new EarnProtocolManager(params)
  }
}
