import { Maybe, ProtocolName } from '@summerfi/sdk-common/common'
import { type IProtocolPlugin } from './IProtocolPlugin'

export interface IProtocolPluginsRegistry {
  getPlugin(params: { protocolName: ProtocolName }): Maybe<IProtocolPlugin>
}
