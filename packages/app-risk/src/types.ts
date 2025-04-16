import type { ColumnType } from 'kysely'

enum RiskType {
  OWNERSHIP = 'OWNERSHIP',
  COUNTERPARTY = 'COUNTERPARTY',
}

export interface RiskDataResponse {
  accountExternalId: string
  address: string
  addressRiskIndicators: {
    category: string
    categoryId: string
    categoryRiskScoreLevel: string
    categoryRiskScoreLevelLabel: string
    incomingVolumeUsd: string
    outgoingVolumeUsd: string
    riskType: RiskType
    totalVolumeUsd: string
  }[]
  addressSubmitted: string
  chain: string
  entities: {
    category: string
    categoryId: string
    riskScoreLevel: number
    riskScoreLevelLabel: string
    trmAppUrl: string
    trmUrn: string
  }[]
  trmAppUrl: string
}

type Timestamp = ColumnType<Date, Date | string, Date | string>

interface WalletRisk {
  address: string
  isRisky: boolean
  lastCheck: Timestamp
}

export interface RiskRequiredDB {
  walletRisk: WalletRisk
}

export interface RiskResponse {
  isRisky?: boolean
  error?: string
}

export interface UseRiskInput {
  chainId: number
  walletAddress?: string
  cookiePrefix: string
  host?: string
}
