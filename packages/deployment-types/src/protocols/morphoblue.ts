import { ProtocolConfigActionEntry, ProtocolConfigDependencyEntry } from './entries'

export type MorphoBlueContractNames = 'MorphoBlue' | 'AdaptiveCurveIrm'

export type MorphoBlueActionNames =
  | `MorphoBlueBorrow`
  | `MorphoBlueDeposit`
  | `MorphoBlueWithdraw`
  | `MorphoBluePayback`

export type MorphoBlueProtocolConfig = Record<
  MorphoBlueContractNames,
  ProtocolConfigDependencyEntry
>
export type MorphoBlueActionsConfig = Record<MorphoBlueActionNames, ProtocolConfigActionEntry>

export type MorphoBlueConfig = {
  dependencies: MorphoBlueProtocolConfig
  actions: MorphoBlueActionsConfig
}
