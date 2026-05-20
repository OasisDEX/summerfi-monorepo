import { type NetworkNames, type SDKVaultishType } from '@summerfi/app-types'

export interface DCAConfig {
  selectedNetwork: NetworkNames
  amount: number
  frequency: number
  neverBuyAbove?: number
  neverSellBelow?: number
  maxTrades?: number
  deadline?: string
}

export type DCAPhase = 'wizard' | 'approval'

/**
 * Allowed source/target vault pair for the DCA flow.
 * Sourced from `lib/dca-addresses.ts`. Eventually this should be backed
 * by an on-chain Merkle root surfaced through the deployment configs.
 */
export interface DCAAllowedPair {
  fromVaultId: string
  toVaultId: string
}

/**
 * Resolved (decorated) source / target vault pair, ready for the wizard.
 */
export interface DCAResolvedPair {
  fromVault: SDKVaultishType
  toVault: SDKVaultishType
}

export type DCAApprovalStepId = 'approve' | 'authorize' | 'create'

export type DCAApprovalStepStatus = 'idle' | 'pending' | 'done' | 'error'

export interface DCAApprovalStep {
  id: DCAApprovalStepId
  title: string
  description: string
  status: DCAApprovalStepStatus
  errorMessage?: string
}

/**
 * Mock position shape used by the position dashboard until the real
 * subgraph / API is wired up.
 */
export interface DCAPositionHistoryEntry {
  date: string
  spent: number
  acquired: number
  price: number
  status: 'filled' | 'skipped'
  tx: string
  note?: string
}

export interface DCAPositionSnapshot {
  id: string
  created: string
  totalDeployed: number
  totalAcquired: number
  avgPrice: number
  currentValue: number
  pnl: number
  executions: number
  skipped: number
  nextRun: string
  status: 'active' | 'paused'
  history: DCAPositionHistoryEntry[]
  targetSpotPrice: number
}
