import { AaveV2ActionNames, AaveV2Config } from './aaveV2'
import { AaveV3ActionNames, AaveV3Config } from './aaveV3'
import { AjnaActionNames, AjnaConfig } from './ajna'
import { MakerConfig } from './maker'
import { MorphoBlueActionNames, MorphoBlueConfig } from './morphoblue'
import { SparkActionNames, SparkConfig } from './spark'

export type ProtocolActionsNames =
  | AaveV2ActionNames
  | AaveV3ActionNames
  | AjnaActionNames
  | MorphoBlueActionNames
  | SparkActionNames

export type ProtocolConfigDependencyEntry = {
  name: string
  address: string
  addToRegistry?: boolean
}

export type ProtocolConfigActionEntry = {
  name: string
  addToRegistry?: boolean
  constructorArgs?: string[]
}

export type ProtocolsConfig = {
  maker: MakerConfig
  aaveV2: AaveV2Config
  aaveV3: AaveV3Config
  spark: SparkConfig
  ajna: AjnaConfig
  morphoblue: MorphoBlueConfig
}
