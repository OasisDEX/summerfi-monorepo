import {
  IProtocolPlugin,
  IProtocolPluginContext,
  IProtocolPluginsRegistry,
} from '@summerfi/protocol-plugins-common'
import { Maybe, ProtocolName } from '@summerfi/sdk-common'

/**
 * @typedef ProtocolPluginConstructor
 * @description Constructor for a protocol plugin
 */
export type ProtocolPluginConstructor = new () => IProtocolPlugin

/**
 * @typedef ProtocolPluginsRecordType
 * @description Record of protocol plugins
 */
export type ProtocolPluginsRecordType = Partial<Record<ProtocolName, ProtocolPluginConstructor>>

/**
 * @class ProtocolPluginsRegistry
 * @description Registry of protocol plugins that can be used to interact with the protocols
 */
export class ProtocolPluginsRegistry implements IProtocolPluginsRegistry {
  readonly plugins: ProtocolPluginsRecordType
  readonly context: IProtocolPluginContext

  constructor(params: { plugins: ProtocolPluginsRecordType; context: IProtocolPluginContext }) {
    this.plugins = params.plugins
    this.context = params.context
  }

  /**
   * @name getPlugin
   * @description Returns a plugin instance for the specified protocol
   * @param params.protocolName The name of the protocol to get the plugin for
   * @returns The plugin instance for the specified protocol
   */
  getPlugin(params: { protocolName: ProtocolName }): Maybe<IProtocolPlugin> {
    const Plugin = this.plugins[params.protocolName]
    if (!Plugin) {
      return
    }
    const plugin = new Plugin()

    plugin.initialize({ context: this.context })

    return plugin
  }
}
