import type { ColumnType } from 'kysely'

export type AddressType = 'ETH' | 'SOL'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export type Json = ColumnType<JsonValue, string, string>

export type JsonArray = JsonValue[]

export type JsonObject = {
  [K in string]?: JsonValue
}

export type JsonPrimitive = boolean | null | number | string

export type JsonValue = JsonArray | JsonObject | JsonPrimitive

export type Protocol = 'AAVE_v2' | 'AAVE_v3' | 'Ajna' | 'ERC_4626' | 'MorphoBlue' | 'Spark'

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export interface EligibilityCondition {
  id: Generated<number>
  description: string
  dueDate: Timestamp
  type: string
  createdAt: Generated<Timestamp>
  metadata: Json
}

export interface PointsDistribution {
  id: Generated<number>
  points: Generated<number>
  description: string
  type: string
  createdAt: Generated<Timestamp>
  positionId: number
  eligibilityConditionId: number | null
}

export interface Position {
  id: Generated<number>
  protocol: Protocol
  chainId: number
  market: string
  address: string
  createdAt: Generated<Timestamp>
  proxyId: number | null
  userAddressId: number
}

export interface Proxy {
  id: Generated<number>
  address: string
  chainId: number
  type: string
  managedBy: string
  userAddressId: number
  createdAt: Generated<Timestamp>
}

export interface User {
  id: Generated<number>
  category: string | null
  createdAt: Generated<Timestamp>
}

export interface UserAddress {
  id: Generated<number>
  address: string
  type: Generated<AddressType>
  createdAt: Generated<Timestamp>
  userId: number
}

export interface Database {
  eligibilityCondition: EligibilityCondition
  pointsDistribution: PointsDistribution
  position: Position
  proxy: Proxy
  user: User
  userAddress: UserAddress
}
