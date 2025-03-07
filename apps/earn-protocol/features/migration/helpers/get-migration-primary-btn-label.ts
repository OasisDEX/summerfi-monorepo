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
 * @param isCorrectNetwork - Whether the user is on the correct network
 * @returns The label text to display on the primary button
 */
export const getMigrationPrimaryBtnLabel = ({
  state,
  isCorrectNetwork,
  networkName,
}: {
  state: MigrationState
  isCorrectNetwork: boolean
  networkName: string
}) => {
  if (state.step === MigrationSteps.INIT) {
    return 'Loading...'
  }

  if (!isCorrectNetwork) {
    return `Switch Network to ${networkName}`
  }

  if (state.step === MigrationSteps.COMPLETED) {
    return 'Go to Position'
  }

  if (state.approveStatus === MigrationTxStatuses.PENDING) {
    return 'Approving...'
  }

  if (state.migrationStatus === MigrationTxStatuses.PENDING) {
    return 'Migrating...'
  }

  if ([state.approveStatus, state.migrationStatus].includes(MigrationTxStatuses.FAILED)) {
    return 'Retry'
  }

  if (state.step === MigrationSteps.APPROVE) {
    return 'Approve'
  }

  return 'Migrate'
}
