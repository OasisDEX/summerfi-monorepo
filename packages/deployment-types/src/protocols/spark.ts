import { MiscDependencyConfigEntry, SystemConfigEntry } from '~deployment-config'

export type SparkContractNames = 'PoolDataProvider' | 'LendingPool' | 'Oracle'
export type SparkActionNames =
  | `SparkBorrow`
  | `SparkDeposit`
  | `SparkWithdraw`
  | `SparkPayback`
  | `SparkSetEMode`

export type SparkProtocolConfig = Record<SparkContractNames, MiscDependencyConfigEntry>
export type SparkActionsConfig = Record<SparkActionNames, SystemConfigEntry>

export type SparkConfig = {
  protocol: SparkProtocolConfig
  actions: SparkActionsConfig
}
