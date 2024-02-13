import { HashedProtocolKey, ProtocolKey } from './types'

export function hashProtocolKey(params: { key: ProtocolKey }): HashedProtocolKey {
  return JSON.stringify(params.key)
}
