import { Protocol } from './Protocol'
import { ProtocolsNames } from '~sdk/protocols'

/**
 * @interface ProtocolsManager
 * @description Represents a protocols manager. Allows to retrieve a protocol by name
 */
export interface ProtocolsManager {
  getProtocol<ProtocolType extends Protocol>(params: { name: ProtocolsNames }): ProtocolType
}
