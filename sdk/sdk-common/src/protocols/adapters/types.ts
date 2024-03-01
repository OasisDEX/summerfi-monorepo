import type { ChainInfo } from '~sdk-common/common/implementation/ChainInfo'
import type { Protocol } from '~sdk-common/protocols/interfaces/Protocol'
import type { ProtocolName } from '~sdk-common/protocols/interfaces/ProtocolName'

export type ProtocolKey = {
  chainInfo: ChainInfo
  name: ProtocolName
}

export type HashedProtocolKey = string

export type ProtocolInfo = {
  chainInfo: ChainInfo
  name: ProtocolName
  protocol: Protocol
}
