import { ProtocolName } from '../interfaces/ProtocolName'

/**
 * @name IPoolId
 * @description Represents a pool's ID. This will be specialized for each protocol
 */
export interface IPoolId {
  protocol: ProtocolName
}
