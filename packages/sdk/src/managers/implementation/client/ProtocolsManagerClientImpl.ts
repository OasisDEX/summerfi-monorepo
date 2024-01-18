import { ProtocolsManager } from '~sdk/managers'
import { Protocol, ProtocolName, ProtocolsRegistry } from '~sdk/protocols'

/**
 * @class ProtocolsManagerClientImpl
 * @description Client implementation for the ProtocolsManager
 * @see ProtocolsManager
 */
export class ProtocolsManagerClientImpl implements ProtocolsManager {
  /// Class Attributes
  private static _instance: ProtocolsManagerClientImpl

  /// Constructor
  private constructor() {}

  /// Instance Methods

  /**
   * @method getSupportedProtocols
   * @see ProtocolsManager#getSupportedProtocols
   */
  public getSupportedProtocols(): ProtocolName[] {
    return ProtocolsRegistry.getSupportedProtocols()
  }

  /**
   * @method getProtocolByName
   * @see ProtocolsManager#getProtocolByName
   */
  public getProtocolByName<ProtocolType extends Protocol>(name: ProtocolName): ProtocolType {
    return ProtocolsRegistry.getProtocol<ProtocolType>(name)
  }

  /// Static Methods

  public static getInstance(): ProtocolsManager {
    if (!this._instance) {
      this._instance = new ProtocolsManagerClientImpl()
    }
    return this._instance
  }
}
