import { Protocol } from '~sdk/protocols'
import { ProtocolName } from './ProtocolName'

/**
 * @class ProtocolsRegistry
 * @description Represents a protocols registry. Allows to register and retrieve protocols by name
 */
export class ProtocolsRegistry {
  /// Class Attributes
  private static _protocols: Map<ProtocolName, Protocol>

  /// Constructor
  private constructor() {}

  /// Static Methods

  /**
   * Registers a new protocol
   *
   * @param name Protocol name
   * @param protocol Protocol instance
   */
  public static registerProtocol(params: { name: ProtocolName; protocol: Protocol }): void {
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
  public static getProtocol<ProtocolType extends Protocol>(name: ProtocolName): ProtocolType {
    const protocol = this._protocols.get(name)
    if (!protocol) {
      throw new Error(`Protocol ${name} not found`)
    }
    return protocol as ProtocolType
  }

  /**
   * Returns the list of supported protocols
   *
   * @returns The list of supported protocols
   */
  public static getSupportedProtocols(): ProtocolName[] {
    return Array.from(this._protocols.keys())
  }
}
