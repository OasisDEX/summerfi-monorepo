import { type SupportedNetworkIds } from '@summerfi/app-types'

export enum MigrationSteps {
  INIT = 'init',
  APPROVE = 'approve',
  MIGRATE = 'migrate',
  COMPLETED = 'completed',
}

export enum MigrationTxStatuses {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export type MigrationState = {
  step: MigrationSteps
  approveStatus: MigrationTxStatuses | undefined
  migrationStatus: MigrationTxStatuses | undefined
  walletAddress: string
}

export type MigrationReducerAction =
  | {
      type: 'update-step'
      payload: MigrationSteps
    }
  | {
      type: 'update-approve-status'
      payload: MigrationTxStatuses | undefined
    }
  | {
      type: 'update-migration-status'
      payload: MigrationTxStatuses | undefined
    }

export interface MigrationEarningsData {
  lazySummerCurrentApy: number
  lazySummer30dApy: number | undefined
  lazySummer7dApy: number | undefined
  // thirtydApyDifferential: number
  // missingOutAmount: number
}

export type MigrationEarningsDataByChainId = {
  [key in SupportedNetworkIds]: MigrationEarningsData
}
