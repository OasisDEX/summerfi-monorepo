import { ProtocolsConfig } from '@summerfi/deployment-types'
import { AAVEV2Configuration } from './mainnet.aaveV2'
import { AAVEV3Configuration } from './mainnet.aaveV3'
import { AjnaConfiguration } from './mainnet.ajna'
import { MakerConfiguration } from './mainnet.maker'
import { MorphoBlueConfiguration } from './mainnet.morphoblue'
import { SparkConfiguration } from './mainnet.spark'

export const ProtocolsConfiguration: ProtocolsConfig = {
  maker: MakerConfiguration,
  aaveV2: AAVEV2Configuration,
  aaveV3: AAVEV3Configuration,
  ajna: AjnaConfiguration,
  morphoblue: MorphoBlueConfiguration,
  spark: SparkConfiguration,
}
