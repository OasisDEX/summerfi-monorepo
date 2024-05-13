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

export interface BlockchainUser {
  category: string | null
  createdAt: Generated<Timestamp>
  id: Generated<number>
  updatedAt: Generated<Timestamp>
}

export interface EligibilityCondition {
  createdAt: Generated<Timestamp>
  description: string
  dueDate: Timestamp
  id: Generated<number>
  metadata: Json
  type: string
  updatedAt: Generated<Timestamp>
}

export interface Multiplier {
  createdAt: Generated<Timestamp>
  description: string | null
  id: Generated<number>
  positionId: number | null
  type: string
  updatedAt: Generated<Timestamp>
  userAddressId: number | null
  value: number
}

export interface PointsDistribution {
  createdAt: Generated<Timestamp>
  description: string
  eligibilityConditionId: number | null
  id: Generated<number>
  points: Generated<number>
  positionId: number | null
  type: string
  updatedAt: Generated<Timestamp>
  userAddressId: number | null
}

export interface Position {
  chainId: number
  createdAt: Generated<Timestamp>
  externalId: string
  id: Generated<number>
  market: string
  protocol: Protocol
  proxyId: number
  type: Generated<PositionType>
  updatedAt: Generated<Timestamp>
  userAddressId: number
}

export interface Proxy {
  address: string
  chainId: number
  createdAt: Generated<Timestamp>
  id: Generated<number>
  managedBy: string
  type: string
  updatedAt: Generated<Timestamp>
  userAddressId: number
}

export interface UserAddress {
  address: string
  createdAt: Generated<Timestamp>
  id: Generated<number>
  type: Generated<AddressType>
  updatedAt: Generated<Timestamp>
  userId: number
}

export interface Database {
  blockchainUser: BlockchainUser
  eligibilityCondition: EligibilityCondition
  multiplier: Multiplier
  pointsDistribution: PointsDistribution
  position: Position
  proxy: Proxy
  userAddress: UserAddress
}
