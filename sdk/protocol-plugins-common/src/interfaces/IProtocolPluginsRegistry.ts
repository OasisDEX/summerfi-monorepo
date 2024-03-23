import { Maybe } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { type IProtocolPlugin } from './IProtocolPlugin'

export interface IProtocolPluginsRegistry {
  getPlugin(params: { protocolName: ProtocolName }): Maybe<IProtocolPlugin>
}
