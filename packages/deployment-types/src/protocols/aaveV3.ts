import { ProtocolConfigActionEntry, ProtocolConfigDependencyEntry } from './protocols'

export type AaveV3ContractNames = 'PoolDataProvider' | 'AavePool' | 'Oracle' | 'AaveL2Encoder'

export type AaveV3ActionNames =
  | `AaveV3Borrow`
  | `AaveV3Deposit`
  | `AaveV3Withdraw`
  | `AaveV3Payback`
  | `AaveV3SetEMode`

export type AaveV3ProtocolConfig = Record<AaveV3ContractNames, ProtocolConfigDependencyEntry>
export type AaveV3ActionsConfig = Record<AaveV3ActionNames, ProtocolConfigActionEntry>

export type AaveV3Config = {
  dependencies: AaveV3ProtocolConfig
  actions: AaveV3ActionsConfig
}
