import type { InsertResult, Kysely } from 'kysely'

import type { RiskRequiredDB } from '@/types'

/**
 * Create a risk entry for a given address in the database.
 *
 * @param db - The Kysely database instance.
 * @param address - The address to create a risk entry for.
 * @param isRisky - A boolean indicating whether the address is considered risky.
 * @returns A promise that resolves when the risk entry has been successfully created.
 *
 * @remarks
 * This function inserts a new entry into the `walletRisk` table of the database with the given address and risk status.
 * The `lastCheck` field is set to the current date and time.
 */
export const createRiskForAddress = async ({
  db,
  address,
  isRisky,
}: {
  db: Kysely<RiskRequiredDB>
  address: string
  isRisky: boolean
}): Promise<InsertResult[]> => {
  try {
    return await db
      .insertInto('walletRisk')
      .values({
        address: address.toLowerCase(),
        isRisky,
        lastCheck: new Date(),
      })
      .execute()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to insert risk entry:', error)

    throw error
  }
}
