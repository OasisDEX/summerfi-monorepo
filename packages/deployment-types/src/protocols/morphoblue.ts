import { ProtocolConfigActionEntry, ProtocolConfigDependencyEntry } from './protocols'

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
  protocol: MorphoBlueProtocolConfig
  actions: MorphoBlueActionsConfig
}
