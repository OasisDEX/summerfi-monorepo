import { Protocol, ProtocolsManager, ProtocolsNames } from '~sdk/protocols'
import { ProtocolsRegistry } from '../adapters/ProtocolsRegistry'

/**
 * @class ProtocolsManager
 * @description Represents a protocols manager. Allows to retrieve a protocol by name
 */
export class ProtocolsManagerBaseImpl implements ProtocolsManager {
  /// Class Attributes
  private static _instance: ProtocolsManager

  /// Constructor
  private constructor() {}

  /// Instance Methods

  /**
   * getProtocol
   *
   * @param name The name of the protocol
   *
   * @returns The protocol instance
   */
  public getProtocol<ProtocolType extends Protocol>(params: {
    name: ProtocolsNames
  }): ProtocolType {
    return ProtocolsRegistry.getProtocol<ProtocolType>(params)
  }

  /// Static Methods

  public static getInstance(): ProtocolsManager {
    if (!this._instance) {
      throw new Error('ProtocolsManager not initialized')
    }
    return this._instance
  }
}
