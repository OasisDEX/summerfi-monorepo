import { DependencyConfigEntry, SystemConfigEntry } from '~deployment-config'

export type AaveV2ContractNames = 'PoolDataProvider' | 'LendingPool' | 'Oracle' | 'WETHGateway'
export type AaveV2ActionNames = 'AaveBorrow' | 'AaveDeposit' | 'AaveWithdraw' | `AavePayback`

export type AaveV2ProtocolConfig = Record<AaveV2ContractNames, DependencyConfigEntry>
export type AaaveV2ActionsConfig = Record<AaveV2ActionNames, SystemConfigEntry>

export type AaveV2Config = {
  protocol: AaveV2ProtocolConfig
  actions: AaaveV2ActionsConfig
}
