import { ProtocolConfigActionEntry, ProtocolConfigDependencyEntry } from './entries'

export type AaveV2ContractNames =
  | 'PoolDataProvider'
  | 'AaveLendingPool'
  | 'Oracle'
  | 'AaveWethGateway'
export type AaveV2ActionNames = 'AaveBorrow' | 'AaveDeposit' | 'AaveWithdraw' | `AavePayback`

export type AaveV2ProtocolConfig = Record<AaveV2ContractNames, ProtocolConfigDependencyEntry>
export type AaaveV2ActionsConfig = Record<AaveV2ActionNames, ProtocolConfigActionEntry>

export type AaveV2Config = {
  dependencies: AaveV2ProtocolConfig
  actions: AaaveV2ActionsConfig
}
