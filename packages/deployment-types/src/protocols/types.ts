import { AaveV2ActionNames } from './aaveV2'
import { AaveV3ActionNames } from './aaveV3'
import { AjnaActionNames } from './ajna'
import { MorphoBlueActionNames } from './morphoblue'
import { SparkActionNames } from './spark'

export type ProtocolActionNames =
  | AaveV2ActionNames
  | AaveV3ActionNames
  | AjnaActionNames
  | MorphoBlueActionNames
  | SparkActionNames
