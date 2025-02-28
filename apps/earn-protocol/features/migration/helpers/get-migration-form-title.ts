import { MigrationSteps } from '@/features/migration/types'

/**
 * Returns the appropriate title text for the migration form based on the current step
 * in the migration process.
 *
 * @param step - The current step in the migration process
 * @returns The title text to display on the migration form
 */
export const getMigrationFormTitle = (step: MigrationSteps): string => {
  switch (step) {
    case MigrationSteps.INIT:
    case MigrationSteps.APPROVE:
    case MigrationSteps.MIGRATE:
      return 'Migrate'
    case MigrationSteps.COMPLETED:
      return 'Migrated successfully'
  }
}
