import { Maybe } from '../../common/aliases/Maybe'
import { ChainInfo } from '../../common/implementation/ChainInfo'
import { Protocol } from '../implementation/Protocol'
import { IProtocol } from '../interfaces/IProtocol'
import { HashedProtocolKey } from './types'
import { hashProtocolKey } from './utils'

/**
 * @class ProtocolsRegistry
 * @description Allows to register and retrieve protocols by name
 *
 * @dev This class offers runtime storage of protocols and it is used to easy the registration and retrieval of protocols
 */
export class ProtocolsRegistry {
  private static _protocols: Map<HashedProtocolKey, Protocol>

  // Private because this class should not be instantiated
  private constructor() {}

  public static registerProtocol(params: { protocol: Protocol }): void {
    if (!this._protocols) {
      this._protocols = new Map()
    }

    if (this.getProtocol({ protocol: params.protocol }) !== undefined) {
      throw new Error(
        `Protocol ${params.protocol.name} already registered on chain ${params.protocol.chainInfo.name}`,
      )
    }

    this._addProtocol(params)
  }

  public static getProtocol(params: { protocol: IProtocol }): Maybe<Protocol> {
    if (!this._protocols) {
      return undefined
    }

    const hashedKey = hashProtocolKey({ protocol: params.protocol })

    return this._protocols.get(hashedKey)
  }

  public static getSupportedProtocols(params: { chainInfo: ChainInfo }): IProtocol[] {
    return Array.from(this._protocols.values()).reduce((acc, value) => {
      if (value.chainInfo.chainId === params.chainInfo.chainId) {
        acc.push(value)
      }
      return acc
    }, [] as Protocol[])
  }

  private static _addProtocol(params: { protocol: Protocol }): void {
    const hashedKey = hashProtocolKey({ protocol: params.protocol })

    this._protocols.set(hashedKey, params.protocol)
  }
}
