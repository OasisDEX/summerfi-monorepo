import { ChainInfo } from '../../common/implementation/ChainInfo'
import { SerializationService } from '../../services'
import { ProtocolName } from '../enums/ProtocolName'
import { IProtocolData } from '../interfaces/IProtocol'

/**
 * @class Protocol
 * @see IProtocolData
 */
export abstract class Protocol implements IProtocolData {
  readonly name: ProtocolName
  readonly chainInfo: ChainInfo

  protected constructor(params: IProtocolData) {
    this.name = params.name
    this.chainInfo = ChainInfo.createFrom(params.chainInfo)
  }

  /**
   * Compare if the passed protocol is equal to the current protocol
   * @param protocol The protocol to compare
   * @returns true if the protocols are equal
   *
   * Equality is determined by the name and chain information
   */
  equals(protocol: Protocol): boolean {
    return this.name === protocol.name && this.chainInfo.equals(protocol.chainInfo)
  }
}

SerializationService.registerClass(Protocol)
