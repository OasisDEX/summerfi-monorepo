import { MiscDependencyConfigEntry, SystemConfigEntry } from '~deployment-config'

export type AaveV3ContractNames = 'PoolDataProvider' | 'LendingPool' | 'Oracle' | 'L2Encoder'

export type AaveV3ActionNames =
  | `AaveV3Borrow`
  | `AaveV3Deposit`
  | `AaveV3Withdraw`
  | `AaveV3Payback`
  | `AaveV3SetEMode`

export type AaveV3ProtocolConfig = Record<AaveV3ContractNames, MiscDependencyConfigEntry>
export type AaveV3ActionsConfig = Record<AaveV3ActionNames, SystemConfigEntry>

export type AaveV3Config = {
  protocol: AaveV3ProtocolConfig
  actions: AaveV3ActionsConfig
}
