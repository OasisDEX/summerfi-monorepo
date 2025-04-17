import { IPrintable } from '../../common/interfaces/IPrintable'
import { SerializationService } from '../../services/SerializationService'
import { ProtocolName } from '../enums/ProtocolName'
import { IChainInfo } from '../interfaces/IChainInfo'
import { IProtocol, IProtocolData, __signature__ } from '../interfaces/IProtocol'

/**
 * Type for the parameters of Price
 */
export type ProtocolParameters = Omit<IProtocolData, 'name'>

/**
 * @class Protocol
 * @see IProtocol
 */
export abstract class Protocol implements IProtocol, IPrintable {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  abstract readonly name: ProtocolName
  readonly chainInfo: IChainInfo

  /** SEALED CONSTRUCTOR */
  protected constructor(params: ProtocolParameters) {
    this.chainInfo = params.chainInfo
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

SerializationService.registerClass(Protocol, { identifier: 'Protocol' })
