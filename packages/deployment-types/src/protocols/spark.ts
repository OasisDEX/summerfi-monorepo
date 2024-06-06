import { ProtocolConfigActionEntry, ProtocolConfigDependencyEntry } from './entries'

export type SparkContractNames = 'SparkDataProvider' | 'SparkLendingPool' | 'SparkOracle'
export type SparkActionNames =
  | `SparkBorrow`
  | `SparkDeposit`
  | `SparkWithdraw`
  | `SparkPayback`
  | `SparkSetEMode`

export type SparkProtocolConfig = Record<SparkContractNames, ProtocolConfigDependencyEntry>
export type SparkActionsConfig = Record<SparkActionNames, ProtocolConfigActionEntry>

export type SparkConfig = {
  dependencies: SparkProtocolConfig
  actions: SparkActionsConfig
}
