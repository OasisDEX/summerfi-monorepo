import {
  type MigrationState,
  MigrationSteps,
  MigrationTxStatuses,
} from '@/features/migration/types'

export const getMigrationPrimaryBtnLabel = ({ state }: { state: MigrationState }) => {
  if (state.step === MigrationSteps.INIT) {
    return 'Loading...'
  }

  if (state.step === MigrationSteps.COMPLETED) {
    return 'Go to Position'
  }

  if (state.approveStatus === MigrationTxStatuses.PENDING) {
    return 'Approving...'
  }

  if (state.migrateStatus === MigrationTxStatuses.PENDING) {
    return 'Migrating...'
  }

  if ([state.approveStatus, state.migrateStatus].includes(MigrationTxStatuses.FAILED)) {
    return 'Retry'
  }

  if (state.step === MigrationSteps.APPROVE) {
    return 'Approve'
  }

  return 'Migrate'
}
