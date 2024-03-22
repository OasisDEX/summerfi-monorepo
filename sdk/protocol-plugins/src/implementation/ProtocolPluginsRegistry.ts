import { ProtocolName } from '@summerfi/sdk-common/protocols'

import { MakerProtocolPlugin } from '../maker/implementation/MakerProtocolPlugin'
import { SparkProtocolPlugin } from '../spark/implementation/SparkProtocolPlugin'
import { AaveV3ProtocolPlugin } from '../aave-v3/implementation/AAVEv3ProtocolPlugin'
import { ProtocolBuilderRegistryType } from '@summerfi/order-planner-common/interfaces'

export const ProtocolPluginsRegistry: ProtocolBuilderRegistryType = {
  [ProtocolName.Maker]: MakerProtocolPlugin,
  [ProtocolName.Spark]: SparkProtocolPlugin,
  [ProtocolName.AAVEv3]: AaveV3ProtocolPlugin,
}
