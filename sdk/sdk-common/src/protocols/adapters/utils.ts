import { IProtocol } from '../interfaces/IProtocol'
import { HashedProtocolKey } from './types'

export function hashProtocolKey(params: { protocol: IProtocol }): HashedProtocolKey {
  return JSON.stringify(params.protocol)
}
