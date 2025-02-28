import {
  type MigrationState,
  MigrationSteps,
  MigrationTxStatuses,
} from '@/features/migration/types'

/**
 * Returns the appropriate label text for the primary button in the migration form
 * based on the current migration state.
 *
 * @param state - The current state of the migration process
 * @returns The label text to display on the primary button
 */
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
