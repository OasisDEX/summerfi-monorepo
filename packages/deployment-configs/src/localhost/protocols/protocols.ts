import { ProtocolsConfig } from '@summerfi/deployment-types'
import { AAVEV2Configuration } from './aaveV2'
import { AAVEV3Configuration } from './aaveV3'
import { AjnaConfiguration } from './ajna'
import { MakerConfiguration } from './maker'
import { MorphoBlueConfiguration } from './morphoblue'
import { SparkConfiguration } from './spark'

export const ProtocolsConfiguration: ProtocolsConfig = {
  maker: MakerConfiguration,
  aaveV2: AAVEV2Configuration,
  aaveV3: AAVEV3Configuration,
  ajna: AjnaConfiguration,
  morphoblue: MorphoBlueConfiguration,
  spark: SparkConfiguration,
}
