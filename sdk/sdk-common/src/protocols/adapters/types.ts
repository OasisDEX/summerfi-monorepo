import { Protocol, ProtocolName } from '~sdk-common/protocols'
import { ChainInfo } from '~sdk-common/chains'

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
