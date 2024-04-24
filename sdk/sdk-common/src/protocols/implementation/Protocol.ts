import { ChainInfo } from '../../common/implementation/ChainInfo'
import { IChainInfo } from '../../common/interfaces/IChainInfo'
import { SerializationService } from '../../services'
import { ProtocolName } from '../enums/ProtocolName'
import { IProtocol } from '../interfaces/IProtocol'

/**
 * @class Protocol
 * @see IProtocol
 */
export abstract class Protocol implements IProtocol {
  readonly name: ProtocolName
  readonly chainInfo: IChainInfo

  protected constructor(params: IProtocol) {
    this.name = params.name
    this.chainInfo = ChainInfo.createFrom(params.chainInfo)
  }
}

SerializationService.registerClass(Protocol)
