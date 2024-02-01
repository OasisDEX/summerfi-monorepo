import { MiscDependencyConfigEntry, SystemConfigEntry } from '~deployment-config'

export type MorphoBlueContractNames = 'MorphoBlue' | 'AdaptiveCurveIrm'

export type MorphoBlueActionNames =
  | `MorphoBlueBorrow`
  | `MorphoBlueDeposit`
  | `MorphoBlueWithdraw`
  | `MorphoBluePayback`

export type MorphoBlueProtocolConfig = Record<MorphoBlueContractNames, MiscDependencyConfigEntry>
export type MorphoBlueActionsConfig = Record<MorphoBlueActionNames, SystemConfigEntry>

export type MorphoBlueConfig = {
  protocol: MorphoBlueProtocolConfig
  actions: MorphoBlueActionsConfig
}
