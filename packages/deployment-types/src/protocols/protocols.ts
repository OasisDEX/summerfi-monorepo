import { AaveV2Config } from './aaveV2'
import { AaveV3Config } from './aaveV3'
import { AjnaConfig } from './ajna'
import { MakerConfig } from './maker'
import { MorphoBlueConfig } from './morphoblue'
import { SparkConfig } from './spark'

export type ProtocolsConfig = {
  maker: MakerConfig
  aaveV2: AaveV2Config
  aaveV3: AaveV3Config
  spark: SparkConfig
  ajna: AjnaConfig
  morphoblue: MorphoBlueConfig
}
