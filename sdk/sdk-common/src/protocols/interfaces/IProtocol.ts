import { ChainInfo } from '../../common/implementation/ChainInfo'
import { ProtocolName } from '../enums/ProtocolName'

/**
 * @interface IProtocol
 * @description Information relative to a protocol
 */
export interface IProtocol {
  name: ProtocolName
  chainInfo: ChainInfo
}
