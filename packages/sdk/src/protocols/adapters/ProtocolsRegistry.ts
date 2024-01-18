import { Protocol } from '~sdk/protocols'
import { ProtocolsNames } from './ProtocolName'

/**
 * @class ProtocolsRegistry
 * @description Represents a protocols registry. Allows to register and retrieve protocols by name
 */
export class ProtocolsRegistry {
  /// Class Attributes
  private static _protocols: Map<ProtocolsNames, Protocol>

  /// Constructor
  private constructor() {}

  /// Static Methods

  /**
   * Registers a new protocol
   *
   * @param name Protocol name
   * @param protocol Protocol instance
   */
  public static registerProtocol(params: { name: ProtocolsNames; protocol: Protocol }): void {
    if (!this._protocols) {
      this._protocols = new Map()
    }

    if (this._protocols.has(params.name)) {
      throw new Error(`Protocol ${params.name} already registered`)
    }

    this._protocols.set(params.name, params.protocol)
  }

  /**
   * Returns a protocol by name
   *
   * @param name Protocol name
   *
   * @returns Protocol instance
   */
  public static getProtocol<ProtocolType extends Protocol>(params: {
    name: ProtocolsNames
  }): ProtocolType {
    const protocol = this._protocols.get(params.name)
    if (!protocol) {
      throw new Error(`Protocol ${params.name} not found`)
    }
    return protocol as ProtocolType
  }
}
