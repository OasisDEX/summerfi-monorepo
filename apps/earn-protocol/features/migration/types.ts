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
  migrateStatus: MigrationTxStatuses | undefined
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
      type: 'update-migrate-status'
      payload: MigrationTxStatuses | undefined
    }
