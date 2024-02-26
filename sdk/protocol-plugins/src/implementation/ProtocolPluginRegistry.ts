import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { Maybe } from '@summerfi/sdk-common/utils'
import { IProtocolPlugin } from '~protocolplugins/interfaces'

type ProtocolPluginConstructor = new () => IProtocolPlugin

export class ProtocolPluginRegistry {
  private static readonly Plugins: Partial<Record<ProtocolName, IProtocolPlugin>> = {}

  static registerProtocolPlugin(
    protocol: ProtocolName,
    pluginClass: ProtocolPluginConstructor,
  ): void {
    ProtocolPluginRegistry.Plugins[protocol] = new pluginClass()
  }

  static getProtocolPlugin(protocol: ProtocolName): Maybe<IProtocolPlugin> {
    return ProtocolPluginRegistry.Plugins[protocol]
  }
}
