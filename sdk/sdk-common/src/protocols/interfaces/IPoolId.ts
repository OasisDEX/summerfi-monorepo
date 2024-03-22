import { IProtocol } from '../../protocols/interfaces/IProtocol'

/**
 * @name IPoolId
 * @description Represents a pool's ID. This will be specialized for each protocol
 */
export interface IPoolId {
  protocol: IProtocol
}

export function isPoolId(maybePoolId: unknown): maybePoolId is IPoolId {
  return typeof maybePoolId === 'object' && maybePoolId !== null && 'protocol' in maybePoolId
}
