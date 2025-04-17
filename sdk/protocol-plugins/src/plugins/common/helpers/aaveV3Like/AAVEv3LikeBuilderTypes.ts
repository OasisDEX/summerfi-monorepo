/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProtocolName, Token } from '@summerfi/sdk-common'

type ReservesConfigData = {
  decimals: bigint
  ltv: bigint
  liquidationThreshold: bigint
  liquidationBonus: bigint
  reserveFactor: bigint
  usageAsCollateralEnabled: boolean
  borrowingEnabled: boolean
  isActive: boolean
  isFrozen: boolean
}
type ReservesCap = {
  borrowCap: bigint
  supplyCap: bigint
}
type ReservesData = {
  unbacked: bigint
  accruedToTreasuryScaled: bigint
  totalAToken: bigint
  totalStableDebt: bigint
  totalVariableDebt: bigint
  liquidityRate: bigint
  variableBorrowRate: bigint
  stableBorrowRate: bigint
  averageStableBorrowRate: bigint
  liquidityIndex: bigint
  variableBorrowIndex: bigint
  lastUpdateTimestamp: bigint
}
export type EmodeCategory = bigint
type OraclePrice = bigint

export type AllowedProtocolNames = ProtocolName.Spark | ProtocolName.AaveV3
export type WithToken<T> = T & { token: Token }
export type WithReservesCaps<T> = T & { caps: ReservesCap }
export type WithReservesConfig<T> = T & { config: ReservesConfigData }
export type WithReservesData<T> = T & { data: ReservesData }
export type WithEmode<T> = T & { emode: EmodeCategory }
export type WithPrice<T> = T & { price: OraclePrice }
