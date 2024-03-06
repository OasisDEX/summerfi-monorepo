import { PoolParameters } from '../interfaces/PoolParameters'
import { ProtocolParameters } from '../interfaces/ProtocolParameters'
import { ProtocolName } from '../enums/ProtocolName'
import { IPool } from '../interfaces/IPool'
import { IProtocol } from '../interfaces/IProtocol'
import { Maybe } from '../../common/aliases/Maybe'
import { ChainInfo } from '../../common/implementation/ChainInfo'

export interface IProtocolSerialized extends IProtocol {
  // empty on purpose
}

/**
 * @interface Protocol
 * @description Represents a protocol. Provides methods for getting pools
 */
export abstract class Protocol implements IProtocol {
  public readonly name: ProtocolName
  public readonly chainInfo: ChainInfo

  constructor(params: { name: ProtocolName; chainInfo: ChainInfo }) {
    this.name = params.name
    this.chainInfo = params.chainInfo
  }

  abstract getPool(params: {
    poolParameters: PoolParameters
    protocolParameters?: ProtocolParameters
  }): Promise<Maybe<IPool>>

  abstract getAllPools(params: { protocolParameters?: ProtocolParameters }): Promise<IPool[]>
}
