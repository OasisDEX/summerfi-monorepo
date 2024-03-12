import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { IProtocolPlugin } from '~protocolplugins/interfaces'

import { MakerProtocolPlugin } from '../maker/MakerProtocolPlugin'
import { SparkProtocolPlugin } from '../spark/SparkProtocolPlugin'

export type ProtocolPluginConstructor = new () => IProtocolPlugin
export type ProtocolPluginRegistryType = Partial<Record<ProtocolName, ProtocolPluginConstructor>>

export const ProtocolPluginsRegistry: ProtocolPluginRegistryType = {
  [ProtocolName.Maker]: MakerProtocolPlugin,
  [ProtocolName.Spark]: SparkProtocolPlugin,
}
