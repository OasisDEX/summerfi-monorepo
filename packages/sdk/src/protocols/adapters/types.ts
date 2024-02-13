import { Protocol, ProtocolName } from '~sdk/protocols'
import { ChainInfo } from '~sdk/chains'

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
