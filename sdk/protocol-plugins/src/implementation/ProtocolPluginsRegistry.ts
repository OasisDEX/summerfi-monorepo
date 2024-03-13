import { ProtocolName } from '@summerfi/sdk-common/protocols'

import { MakerProtocolPlugin } from '../maker/MakerProtocolPlugin'
import { SparkProtocolPlugin } from '../spark/SparkProtocolPlugin'
import { ProtocolBuilderRegistryType } from '@summerfi/order-planner-common/interfaces'

export const ProtocolPluginsRegistry: ProtocolBuilderRegistryType = {
  [ProtocolName.Maker]: MakerProtocolPlugin,
  [ProtocolName.Spark]: SparkProtocolPlugin,
}
