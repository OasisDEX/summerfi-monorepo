import { ChainInfo } from '../../common/implementation/ChainInfo'
import { IPrintable } from '../../common/interfaces/IPrintable'
import { SerializationService } from '../../services'
import { ProtocolName } from '../enums/ProtocolName'
import { IProtocol, IProtocolData } from '../interfaces/IProtocol'

/**
 * @class Protocol
 * @see IProtocolData
 */
export abstract class Protocol implements IProtocol, IPrintable {
  readonly name: ProtocolName
  readonly chainInfo: ChainInfo

  protected constructor(params: IProtocolData) {
    this.name = params.name
    this.chainInfo = ChainInfo.createFrom(params.chainInfo)
  }

  equals(protocol: Protocol): boolean {
    return this.name === protocol.name && this.chainInfo.equals(protocol.chainInfo)
  }

  toString(): string {
    return `Protocol: ${this.name} on ${this.chainInfo.toString()}`
  }
}

SerializationService.registerClass(Protocol)
