import { type MigrationState, MigrationTxStatuses } from '@/features/migration/types'

export const getMigrationSidebarError = ({ state }: { state: MigrationState }) => {
  if (state.approveStatus === MigrationTxStatuses.FAILED) {
    return 'Failed to approve, please try again'
  }

  if (state.migrateStatus === MigrationTxStatuses.FAILED) {
    return 'Failed to migrate, please try again'
  }

  return undefined
}
