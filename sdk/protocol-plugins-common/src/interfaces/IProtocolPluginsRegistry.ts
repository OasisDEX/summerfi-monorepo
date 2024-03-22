import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { IProtocolPlugin } from './IProtocolPlugin'

export interface IProtocolPluginsRegistry {
  getPlugin(params: { protocolName: ProtocolName }): IProtocolPlugin
}
