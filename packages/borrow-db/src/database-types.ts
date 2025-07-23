import type { ColumnType } from 'kysely'

export type AjnaRewardsPositionType = 'borrow' | 'earn'

export type AjnaRewardsSource = 'bonus' | 'core'

export type ArrayType<T> = ArrayTypeImpl<T> extends (infer U)[] ? U[] : ArrayTypeImpl<T>

export type ArrayTypeImpl<T> =
  T extends ColumnType<infer S, infer I, infer U> ? ColumnType<S[], I[], U[]> : T[]

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

export type Numeric = ColumnType<string, number | string, number | string>

export type Product = 'borrow' | 'earn' | 'multiply'

export type Protocol = 'aavev2' | 'aavev3' | 'ajna' | 'maker' | 'morphoblue' | 'sky' | 'sparkv3'

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export type VaultType = 'borrow' | 'earn' | 'multiply'

export interface AjnaRewardsDailyClaim {
  accountAddress: string
  amount: string
  chainId: number
  dayNumber: number
  id: Generated<number>
  poolAddress: string
  source: AjnaRewardsSource
  timestamp: Generated<Timestamp>
  type: AjnaRewardsPositionType
  userAddress: string
  weekNumber: number
}

export interface AjnaRewardsMerkleTree {
  chainId: number
  id: Generated<number>
  source: AjnaRewardsSource
  timestamp: Generated<Timestamp>
  treeRoot: string
  txProcessed: Generated<boolean>
  weekNumber: number
}

export interface AjnaRewardsWeeklyClaim {
  amount: string
  chainId: number
  id: Generated<number>
  proof: string[] | null
  source: AjnaRewardsSource
  timestamp: Generated<Timestamp>
  userAddress: string
  weekNumber: number
}

export interface CollateralType {
  collateralName: string
  currentPrice: Numeric
  liquidationPenalty: Generated<Numeric | null>
  liquidationRatio: Numeric
  marketPrice: Numeric | null
  nextPrice: Numeric
  rate: Numeric | null
}

export interface Discover {
  collateralType: string
  createdAt: Generated<Timestamp>
  lastAction: Json
  netProfit1d: Numeric | null
  netProfit30d: Numeric | null
  netProfit365d: Numeric | null
  netProfit7d: Numeric | null
  netProfitAll: Numeric | null
  netProfitYtd: Numeric | null
  pnl1d: Numeric
  pnl30d: Numeric
  pnl365d: Numeric
  pnl7d: Numeric
  pnlAll: Numeric
  pnlYtd: Numeric
  positionId: string
  protocolId: string
  status: Json
  token: string | null
  updatedAt: Timestamp
  vaultCollateral: Numeric
  vaultDebt: Numeric
  vaultNormalizedDebt: Numeric | null
  vaultType: string | null
  yield30d: Numeric
}

export interface DiscoverWithCollData {
  chainId: number | null
  collateralName: string | null
  collateralType: string | null
  createdAt: Timestamp | null
  currentPrice: Numeric | null
  lastAction: Json | null
  liquidationPenalty: Numeric | null
  liquidationRatio: Numeric | null
  marketPrice: Numeric | null
  netProfit1d: Numeric | null
  netProfit30d: Numeric | null
  netProfit365d: Numeric | null
  netProfit7d: Numeric | null
  netProfitAll: Numeric | null
  netProfitYtd: Numeric | null
  nextPrice: Numeric | null
  ownerAddress: string | null
  pnl1d: Numeric | null
  pnl30d: Numeric | null
  pnl365d: Numeric | null
  pnl7d: Numeric | null
  pnlAll: Numeric | null
  pnlYtd: Numeric | null
  positionId: string | null
  protocolId: string | null
  rate: Numeric | null
  status: Json | null
  token: string | null
  type: VaultType | null
  updatedAt: Timestamp | null
  vaultCollateral: Numeric | null
  vaultDebt: Numeric | null
  vaultId: number | null
  vaultNormalizedDebt: Numeric | null
  vaultType: string | null
  yield30d: Numeric | null
}

export interface HighestPnl {
  collateralType: string | null
  collateralValue: Numeric | null
  lastAction: Json | null
  netProfit1d: Numeric | null
  netProfit30d: Numeric | null
  netProfit365d: Numeric | null
  netProfit7d: Numeric | null
  netProfitAll: Numeric | null
  netProfitYtd: Numeric | null
  pnl1d: Numeric | null
  pnl30d: Numeric | null
  pnl365d: Numeric | null
  pnl7d: Numeric | null
  pnlAll: Numeric | null
  pnlYtd: Numeric | null
  positionId: string | null
  protocolId: string | null
  token: string | null
  type: VaultType | null
  vaultMultiple: Numeric | null
}

export interface HighRisk {
  collateralRatio: Numeric | null
  collateralType: string | null
  collateralValue: Numeric | null
  liquidationPrice: Numeric | null
  liquidationProximity: Numeric | null
  liquidationValue: Numeric | null
  nextPrice: Numeric | null
  positionId: string | null
  protocolId: string | null
  status: Json | null
  token: string | null
  type: VaultType | null
}

export interface LargestDebt {
  collateralType: string | null
  collateralValue: Numeric | null
  collRatio: Numeric | null
  lastAction: Json | null
  liquidationProximity: Numeric | null
  positionId: string | null
  protocolId: string | null
  token: string | null
  type: VaultType | null
  vaultDebt: Numeric | null
}

export interface MerkleTree {
  endBlock: Numeric | null
  snapshot: string | null
  startBlock: Numeric | null
  timestamp: Generated<Timestamp | null>
  treeRoot: string
  txProcessed: Generated<boolean>
  weekNumber: number
}

export interface Migrations {
  executedAt: Generated<Timestamp | null>
  hash: string
  id: number
  name: string
}

export interface MostYield {
  collateralType: string | null
  collateralValue: Numeric | null
  lastAction: Json | null
  liquidationValue: Numeric | null
  netValue: Numeric | null
  pnl1d: Numeric | null
  pnl30d: Numeric | null
  pnl365d: Numeric | null
  pnl7d: Numeric | null
  pnlAll: Numeric | null
  pnlYtd: Numeric | null
  positionId: string | null
  protocolId: string | null
  token: string | null
  type: VaultType | null
  yield30d: Numeric | null
}

export interface ProductHubItems {
  automationFeatures: string[] | null
  depositToken: string | null
  earnStrategy: 'erc_4626' | 'liquidity_provision' | 'other' | 'yield_loop' | null
  earnStrategyDescription: string | null
  fee: string | null
  hasRewards: Generated<boolean>
  id: string
  label: string
  liquidity: string | null
  managementType: 'active' | 'passive' | null
  maxLtv: string | null
  maxMultiply: string | null
  multiplyStrategy: string | null
  multiplyStrategyType: 'long' | 'short' | null
  network:
    | 'arbitrum'
    | 'arbitrum_goerli'
    | 'base'
    | 'base_goerli'
    | 'ethereum'
    | 'ethereum_goerli'
    | 'optimism'
    | 'optimism_goerli'
    | 'polygon'
    | 'polygon_mumbai'
  primaryToken: string
  primaryTokenAddress: Generated<string>
  primaryTokenGroup: string | null
  product: ArrayType<Product> | null
  protocol: Protocol
  reverseTokens: boolean | null
  secondaryToken: string
  secondaryTokenAddress: Generated<string>
  secondaryTokenGroup: string | null
  tooltips: Json | null
  updatedAt: Timestamp
  weeklyNetApy: string | null
}

export interface RaysDailyChallenge {
  address: string
  claimedDates: string[] | null
  id: Generated<number>
}

export interface Tokens {
  address: string
  chainId: number
  name: string
  precision: number
  source: string | null
  symbol: string
}

export interface TosApproval {
  address: string
  chainId: Generated<number>
  docVersion: string
  id: Generated<number>
  message: Generated<string>
  signature: Generated<string>
  signDate: Timestamp
}

export interface User {
  accepted: boolean
  address: string
  timestamp: Generated<Timestamp>
  userThatReferredAddress: string | null
}

export interface UsersWhoFollowVaults {
  protocol: Protocol
  userAddress: string
  vaultChainId: number
  vaultId: number
}

export interface Vault {
  chainId: number | null
  ownerAddress: string
  protocol: Generated<string>
  tokenPair: Generated<string>
  type: VaultType
  vaultId: number
}

export interface VaultChangeLog {
  chainId: number
  createdAt: Generated<Timestamp>
  id: Generated<number>
  newVaultType: VaultType | null
  oldVaultType: VaultType | null
  ownerAddress: string
  protocol: string
  tokenPair: string
  vaultId: number
}

export interface WalletRisk {
  address: string
  isRisky: boolean
  lastCheck: Timestamp
}

export interface WeeklyClaim {
  amount: string
  id: Generated<number>
  proof: string[] | null
  timestamp: Generated<Timestamp | null>
  userAddress: string
  weekNumber: number
}

export interface DB {
  ajnaRewardsDailyClaim: AjnaRewardsDailyClaim
  ajnaRewardsMerkleTree: AjnaRewardsMerkleTree
  ajnaRewardsWeeklyClaim: AjnaRewardsWeeklyClaim
  collateralType: CollateralType
  discover: Discover
  discoverWithCollData: DiscoverWithCollData
  highestPnl: HighestPnl
  highRisk: HighRisk
  largestDebt: LargestDebt
  merkleTree: MerkleTree
  migrations: Migrations
  mostYield: MostYield
  productHubItems: ProductHubItems
  raysDailyChallenge: RaysDailyChallenge
  tokens: Tokens
  tosApproval: TosApproval
  user: User
  usersWhoFollowVaults: UsersWhoFollowVaults
  vault: Vault
  vaultChangeLog: VaultChangeLog
  walletRisk: WalletRisk
  weeklyClaim: WeeklyClaim
}
