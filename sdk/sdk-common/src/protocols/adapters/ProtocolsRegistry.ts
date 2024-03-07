import { Maybe } from '../../common/aliases/Maybe'
import { ChainInfo } from '../../common/implementation/ChainInfo'
import { Protocol } from '../interfaces/Protocol'
import { ProtocolName } from '../interfaces/ProtocolName'
import { HashedProtocolKey, ProtocolInfo, ProtocolKey } from './types'
import { hashProtocolKey } from './utils'

/**
 * @class ProtocolsRegistry
 * @description Allows to register and retrieve protocols by name
 *
 * @dev This class offers runtime storage of protocols and it is used to easy the registration and retrieval of protocols
 */
export class ProtocolsRegistry {
  private static _protocols: Map<HashedProtocolKey, ProtocolInfo>

  // Private because this class should not be instantiated
  private constructor() {}

  public static registerProtocol(params: {
    chainInfo: ChainInfo
    name: ProtocolName
    protocol: Protocol
  }): void {
    if (!this._protocols) {
      this._protocols = new Map()
    }

    if (this.getProtocol({ chainInfo: params.chainInfo, name: params.name }) !== undefined) {
      throw new Error(
        `Protocol ${params.name} already registered on chain ${params.chainInfo.name}`,
      )
    }

    this._addProtocol(params)
  }

  public static getProtocol<ProtocolType extends Protocol>(params: {
    chainInfo: ChainInfo
    name: ProtocolName
  }): Maybe<ProtocolType> {
    if (!this._protocols) {
      return undefined
    }

    const key: ProtocolKey = {
      chainInfo: params.chainInfo,
      name: params.name,
    }

    const hashedKey = hashProtocolKey({ key })

    const protocolInfo = this._protocols.get(hashedKey)
    if (!protocolInfo) {
      return undefined
    }

    return protocolInfo.protocol as Maybe<ProtocolType>
  }

  public static getSupportedProtocols(params: { chainInfo: ChainInfo }): ProtocolName[] {
    return Array.from(this._protocols.values()).reduce((acc, value) => {
      if (value.chainInfo.chainId === params.chainInfo.chainId) {
        acc.push(value.name)
      }
      return acc
    }, [] as ProtocolName[])
  }

  private static _addProtocol(params: {
    chainInfo: ChainInfo
    name: ProtocolName
    protocol: Protocol
  }): void {
    const key: ProtocolKey = {
      chainInfo: params.chainInfo,
      name: params.name,
    }

    const hashedKey = hashProtocolKey({ key })

    this._protocols.set(hashedKey, {
      chainInfo: params.chainInfo,
      name: params.name,
      protocol: params.protocol,
    })
  }
}
