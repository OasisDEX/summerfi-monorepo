import { ProtocolName } from '@summerfi/sdk-common/protocols'
import {
  IProtocolPlugin,
  IProtocolPluginContext,
  IProtocolPluginsRegistry,
} from '@summerfi/protocol-plugins-common'
import { Maybe } from '@summerfi/sdk-common/common'

export type ProtocolPluginConstructor = new (params: {
  context: IProtocolPluginContext
  deploymentConfigTag: string
}) => IProtocolPlugin

export type ProtocolPluginsRecordType = Partial<Record<ProtocolName, ProtocolPluginConstructor>>

export class ProtocolPluginsRegistry implements IProtocolPluginsRegistry {
  readonly plugins: ProtocolPluginsRecordType
  readonly context: IProtocolPluginContext
  readonly deploymentConfigTag: string

  constructor(params: {
    plugins: ProtocolPluginsRecordType
    context: IProtocolPluginContext
    deploymentConfigTag: string
  }) {
    this.plugins = params.plugins
    this.context = params.context
    this.deploymentConfigTag = params.deploymentConfigTag
  }

  getPlugin(params: { protocolName: ProtocolName }): Maybe<IProtocolPlugin> {
    const Plugin = this.plugins[params.protocolName]
    if (!Plugin) {
      return
    }
    return new Plugin({ context: this.context, deploymentConfigTag: this.deploymentConfigTag })
  }
}
