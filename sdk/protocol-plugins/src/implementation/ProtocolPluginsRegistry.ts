import { ProtocolName } from '@summerfi/sdk-common/protocols'
import {
  IProtocolPlugin,
  IProtocolPluginContext,
  IProtocolPluginsRegistry,
} from '@summerfi/protocol-plugins-common'
import { Maybe } from '@summerfi/sdk-common/common'

export type ProtocolPluginConstructor = new (params: {
  context: IProtocolPluginContext
}) => IProtocolPlugin

export type ProtocolPluginsRecordType = Partial<Record<ProtocolName, ProtocolPluginConstructor>>

export class ProtocolPluginsRegistry implements IProtocolPluginsRegistry {
  readonly plugins: ProtocolPluginsRecordType
  readonly context: IProtocolPluginContext

  constructor(params: { plugins: ProtocolPluginsRecordType; context: IProtocolPluginContext }) {
    this.plugins = params.plugins
    this.context = params.context
  }

  getPlugin(params: { protocolName: ProtocolName }): Maybe<IProtocolPlugin> {
    const Plugin = this.plugins[params.protocolName]
    if (!Plugin) {
      return
    }
    return new Plugin({ context: this.context })
  }
}
