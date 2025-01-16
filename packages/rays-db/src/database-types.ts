import type { ColumnType } from 'kysely'

export type AddressType = 'ETH' | 'SOL'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>

export type Json = JsonValue

export type JsonArray = JsonValue[]

export type JsonObject = {
  [K in string]?: JsonValue
}

export type JsonPrimitive = boolean | number | string | null

export type JsonValue = JsonArray | JsonObject | JsonPrimitive

export type Numeric = ColumnType<string, number | string, number | string>

export type PositionType = 'Lend' | 'Supply'

export type Protocol = 'aave_v2' | 'aave_v3' | 'ajna' | 'erc4626' | 'maker' | 'morphoblue' | 'spark'

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export interface BlockchainUser {
  category: string | null
  createdAt: Generated<Timestamp>
  id: Generated<number>
  updatedAt: Generated<Timestamp>
}

export interface CronJob {
  active: Generated<boolean>
  command: string
  database: Generated<string>
  jobid: Generated<Int8>
  jobname: string | null
  nodename: Generated<string>
  nodeport: Generated<number>
  schedule: string
  username: Generated<string>
}

export interface CronJobRunDetails {
  command: string | null
  database: string | null
  endTime: Timestamp | null
  jobid: Int8 | null
  jobPid: number | null
  returnMessage: string | null
  runid: Generated<Int8>
  startTime: Timestamp | null
  status: string | null
  username: string | null
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

export interface LeaderboardHistory {
  lastUpdated: Generated<Timestamp | null>
  points0h: Numeric
  points10h: Numeric | null
  points12h: Numeric | null
  points14h: Numeric | null
  points16h: Numeric | null
  points18h: Numeric | null
  points20h: Numeric | null
  points22h: Numeric | null
  points2h: Numeric | null
  points4h: Numeric | null
  points6h: Numeric | null
  points8h: Numeric | null
  position0h: Int8
  position10h: Int8 | null
  position12h: Int8 | null
  position14h: Int8 | null
  position16h: Int8 | null
  position18h: Int8 | null
  position20h: Int8 | null
  position22h: Int8 | null
  position2h: Int8 | null
  position4h: Int8 | null
  position6h: Int8 | null
  position8h: Int8 | null
  userAddressId: string
}

export interface Multiplier {
  createdAt: Generated<Timestamp>
  description: string | null
  id: Generated<number>
  positionId: number | null
  type: string
  updatedAt: Generated<Timestamp>
  userAddressId: number | null
  value: Numeric
}

export interface PointsDistribution {
  createdAt: Generated<Timestamp>
  description: string
  eligibilityConditionId: number | null
  id: Generated<number>
  points: Generated<Numeric>
  positionId: number | null
  type: string
  updatedAt: Generated<Timestamp>
  userAddressId: number | null
}

export interface Leaderboard {
  position: Int8 | null
  totalPoints: Numeric | null
  userAddress: string | null
  details: Json | null
  ens: string | null
}
export interface LeaderboardNew {
  position: Int8 | null
  rank: Int8 | null
  rank22h: Int8 | null
  points22h: Numeric | null
  totalPoints: Numeric | null
  userAddress: string | null
  details: Json | null
  ens: string | null
  tgeSnapshotPoints: Numeric | null
  tgeSumrAwarded: Numeric | null
}
export interface Position {
  address: string
  chainId: number
  createdAt: Generated<Timestamp>
  details: Json | null
  externalId: string
  id: Generated<number>
  market: string
  protocol: Protocol
  type: Generated<PositionType>
  updatedAt: Generated<Timestamp>
  userAddressId: number
  vaultId: number
}

export interface Snapshot {
  createdAt: Generated<Timestamp>
  id: Generated<number>
  name: string
  points: Generated<Numeric>
  sumrAwarded: Generated<Numeric>
  updatedAt: Generated<Timestamp>
  userAddressId: number
}

export interface UpdatePointsChangelog {
  createdAt: Generated<Timestamp>
  endTimestamp: Timestamp
  id: Generated<number>
  metadata: Json
  startTimestamp: Timestamp
}

export interface UpdatePointsLastRun {
  id: string
  lastTimestamp: Generated<Timestamp>
}

export interface UpdatePointsLock {
  id: string
  isLocked: Generated<boolean>
}

export interface UserAddress {
  address: string
  createdAt: Generated<Timestamp>
  details: Json | null
  ens: string | null
  id: Generated<number>
  type: Generated<AddressType>
  updatedAt: Generated<Timestamp>
  userId: number
}

export interface Database {
  blockchainUser: BlockchainUser
  'cron.job': CronJob
  'cron.jobRunDetails': CronJobRunDetails
  eligibilityCondition: EligibilityCondition
  leaderboardHistory: LeaderboardHistory
  multiplier: Multiplier
  pointsDistribution: PointsDistribution
  position: Position
  snapshot: Snapshot
  updatePointsChangelog: UpdatePointsChangelog
  updatePointsLastRun: UpdatePointsLastRun
  updatePointsLock: UpdatePointsLock
  userAddress: UserAddress
  leaderboard: Leaderboard
  // to be removed after we check if its all valid
  leaderboard_new: LeaderboardNew
}
