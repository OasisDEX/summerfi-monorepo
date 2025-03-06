import { type MigrationState, MigrationTxStatuses } from '@/features/migration/types'

/**
 * Returns an error message for the migration sidebar based on the current state
 * of the migration process.
 *
 * @param state - The current state of the migration process
 * @returns The error message to display on the migration sidebar, or undefined if no error
 */
export const getMigrationSidebarError = ({ state }: { state: MigrationState }) => {
  if (state.approveStatus === MigrationTxStatuses.FAILED) {
    return 'Failed to approve, please try again'
  }

  if (state.migrationStatus === MigrationTxStatuses.FAILED) {
    return 'Failed to migrate, please try again'
  }

  return undefined
}
