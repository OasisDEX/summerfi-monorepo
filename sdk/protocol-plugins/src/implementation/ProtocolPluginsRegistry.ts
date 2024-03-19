import { ProtocolName } from '@summerfi/sdk-common/protocols'

import { MakerProtocolPlugin } from '../maker/MakerProtocolPlugin'
import { SparkProtocolPlugin } from '../spark/SparkProtocolPlugin'
import { AaveV3ProtocolPlugin } from '../aave-v3/AAVEv3ProtocolPlugin'
import { ProtocolBuilderRegistryType } from '@summerfi/order-planner-common/interfaces'

export const ProtocolPluginsRegistry: ProtocolBuilderRegistryType = {
  [ProtocolName.Maker]: MakerProtocolPlugin,
  [ProtocolName.Spark]: SparkProtocolPlugin,
  [ProtocolName.AAVEv3]: AaveV3ProtocolPlugin,
}
