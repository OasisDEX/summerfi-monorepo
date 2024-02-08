import { ChainInfo } from '~sdk/chains'
import { Protocol, ProtocolName } from '~sdk/protocols'

type ProtocolKey = {
  chainInfo: ChainInfo
  name: ProtocolName
}

/**
 * @class ProtocolsRegistry
 * @description Allows to register and retrieve protocols by name
 *
 * @dev This class offers runtime storage of protocols and it is used to easy the registration and retrieval of protocols
 */
export class ProtocolsRegistry {
  private static _protocols: Map<ProtocolKey, Protocol>

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

    const key: ProtocolKey = {
      chainInfo: params.chainInfo,
      name: params.name,
    }

    if (this._protocols.has(key)) {
      throw new Error(
        `Protocol ${params.name} already registered on chain ${params.chainInfo.name}`,
      )
    }

    this._protocols.set(key, params.protocol)
  }

  public static getProtocol<ProtocolType extends Protocol>(params: {
    chainInfo: ChainInfo
    name: ProtocolName
  }): ProtocolType {
    const key: ProtocolKey = {
      chainInfo: params.chainInfo,
      name: params.name,
    }

    const protocol = this._protocols.get(key)
    if (!protocol) {
      throw new Error(`Protocol ${params.name} not found`)
    }
    return protocol as ProtocolType
  }

  public static getSupportedProtocols(params: { chainInfo: ChainInfo }): ProtocolName[] {
    return Array.from(this._protocols.keys()).reduce((acc, key) => {
      if (key.chainInfo.chainId === params.chainInfo.chainId) {
        acc.push(key.name)
      }
      return acc
    }, [] as ProtocolName[])
  }
}
