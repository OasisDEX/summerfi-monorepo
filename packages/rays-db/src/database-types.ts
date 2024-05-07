import type { ColumnType } from 'kysely'

export type AddressType = 'ETH' | 'SOL'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export type Json = JsonValue

export type JsonArray = JsonValue[]

export type JsonObject = {
  [K in string]?: JsonValue
}

export type JsonPrimitive = boolean | number | string | null

export type JsonValue = JsonArray | JsonObject | JsonPrimitive

export type PositionType = 'Lend' | 'Supply'

export type Protocol = 'AAVE_v2' | 'AAVE_v3' | 'Ajna' | 'ERC_4626' | 'MorphoBlue' | 'Spark'

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export interface EligibilityCondition {
  createdAt: Generated<Timestamp>
  description: string
  dueDate: Timestamp
  id: Generated<number>
  metadata: Json
  type: string
}

export interface Multiplier {
  createdAt: Generated<Timestamp>
  description: string | null
  id: Generated<number>
  type: string
  value: number
}

export interface PointsDistribution {
  createdAt: Generated<Timestamp>
  description: string
  eligibilityConditionId: number | null
  id: Generated<number>
  points: Generated<number>
  positionId: number
  type: string
}

export interface Position {
  address: string
  chainId: number
  createdAt: Generated<Timestamp>
  id: Generated<number>
  market: string
  protocol: Protocol
  proxyId: number | null
  type: Generated<PositionType>
  userAddressId: number
}

export interface PositionMultiplier {
  createdAt: Generated<Timestamp>
  id: Generated<number>
  multiplierId: number
  positionId: number
}

export interface Proxy {
  address: string
  chainId: number
  createdAt: Generated<Timestamp>
  id: Generated<number>
  managedBy: string
  type: string
  userAddressId: number
}

export interface User {
  category: string | null
  createdAt: Generated<Timestamp>
  id: Generated<number>
}

export interface UserAddress {
  address: string
  createdAt: Generated<Timestamp>
  id: Generated<number>
  type: Generated<AddressType>
  userId: number
}

export interface UserAddressMultiplier {
  createdAt: Generated<Timestamp>
  id: Generated<number>
  multiplierId: number
  userAddressId: number
}

export interface Database {
  eligibilityCondition: EligibilityCondition
  multiplier: Multiplier
  pointsDistribution: PointsDistribution
  position: Position
  positionMultiplier: PositionMultiplier
  proxy: Proxy
  user: User
  userAddress: UserAddress
  userAddressMultiplier: UserAddressMultiplier
}
