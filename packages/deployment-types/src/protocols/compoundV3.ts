import { ProtocolConfigActionEntry, ProtocolConfigDependencyEntry } from './entries'

export type CompoundV3ContractNames = 'Comet'

export type CompoundV3ActionNames =
  | `CompoundV3Borrow`
  | `CompoundV3Deposit`
  | `CompoundV3Withdraw`
  | `CompoundV3Payback`

export type CompoundV3ProtocolConfig = Record<
  CompoundV3ContractNames,
  ProtocolConfigDependencyEntry
>
export type CompoundV3ActionsConfig = Record<CompoundV3ActionNames, ProtocolConfigActionEntry>

export type CompoundV3Config = {
  dependencies: CompoundV3ProtocolConfig
  actions: CompoundV3ActionsConfig
}
