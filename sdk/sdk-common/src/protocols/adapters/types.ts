import type { ChainInfo } from '~sdk-common/common'
import { Protocol, ProtocolName } from '~sdk-common/protocols'

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
