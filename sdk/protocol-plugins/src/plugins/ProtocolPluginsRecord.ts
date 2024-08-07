import { ProtocolName } from '@summerfi/sdk-common'
import { ProtocolPluginsRecordType } from '../implementation/ProtocolPluginsRegistry'
import { AaveV3ProtocolPlugin } from './aave-v3/implementation/AAVEv3ProtocolPlugin'
import { MakerProtocolPlugin } from './maker/implementation/MakerProtocolPlugin'
import { MorphoProtocolPlugin } from './morphoblue/implementation/MorphoProtocolPlugin'
import { SparkProtocolPlugin } from './spark/implementation/SparkProtocolPlugin'

/**
 * Protocol plugins record
 *
 * Note: add here the plugins you want to use in the SDK
 */
export const ProtocolPluginsRecord: ProtocolPluginsRecordType = {
  [ProtocolName.Maker]: MakerProtocolPlugin,
  [ProtocolName.Spark]: SparkProtocolPlugin,
  [ProtocolName.AaveV3]: AaveV3ProtocolPlugin,
  [ProtocolName.MorphoBlue]: MorphoProtocolPlugin,
}
