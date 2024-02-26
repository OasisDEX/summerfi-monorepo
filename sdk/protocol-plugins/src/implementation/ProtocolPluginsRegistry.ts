import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { IProtocolPlugin } from '~protocolplugins/interfaces'

type ProtocolPluginConstructor = new () => IProtocolPlugin

export class ProtocolPluginsRegistry {
  private static readonly Plugins: Partial<Record<ProtocolName, IProtocolPlugin>> = {}

  static registerProtocolPlugin(
    protocol: ProtocolName,
    pluginClass: ProtocolPluginConstructor,
  ): void {
    ProtocolPluginsRegistry.Plugins[protocol] = new pluginClass()
  }

  static getProtocolPlugin(protocol: ProtocolName): IProtocolPlugin | undefined {
    return ProtocolPluginsRegistry.Plugins[protocol]
  }
}
