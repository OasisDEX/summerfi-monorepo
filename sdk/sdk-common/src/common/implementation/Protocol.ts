import { ChainInfo } from '../../common/implementation/ChainInfo'
import { IPrintable } from '../../common/interfaces/IPrintable'
import { SerializationService } from '../../services'
import { ProtocolName } from '../enums/ProtocolName'
import { IChainInfo } from '../interfaces/IChainInfo'
import { IProtocol, IProtocolParameters, __signature__ } from '../interfaces/IProtocol'

/**
 * @class Protocol
 * @see IProtocol
 */
export abstract class Protocol implements IProtocol, IPrintable {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly name: ProtocolName
  readonly chainInfo: IChainInfo

  /** SEALED CONSTRUCTOR */
  protected constructor(params: IProtocolParameters) {
    this.name = params.name
    this.chainInfo = ChainInfo.createFrom(params.chainInfo)
  }

  /** METHODS */

  /** @see IProtocol.equals */
  equals(protocol: Protocol): boolean {
    return this.name === protocol.name && this.chainInfo.equals(protocol.chainInfo)
  }

  /** @see IPrintable.toString */
  toString(): string {
    return `Protocol: ${this.name} on ${this.chainInfo.toString()}`
  }
}

SerializationService.registerClass(Protocol)
