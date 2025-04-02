import type { Kysely, UpdateResult } from 'kysely'

import type { RiskRequiredDB } from '@/types'

/**
 * Update the risk record for a given address in the database.
 *
 * This function updates the `walletRisk` table with the new risk status and the current timestamp for the provided address.
 * The address is converted to lowercase before updating to ensure case-insensitive matching.
 *
 * @param db - The Kysely database instance.
 * @param address - The address to update the risk record for.
 * @param isRisky - The new risk status to be set.
 * @returns A promise that resolves to the result of the update operation.
 * @throws Will throw an error if the database operation fails.
 */
export const updateRiskForAddress = async ({
  db,
  address,
  isRisky,
}: {
  db: Kysely<RiskRequiredDB>
  address: string
  isRisky: boolean
}): Promise<UpdateResult[]> => {
  const lowerCaseAddress = address.toLowerCase()

  return await db
    .updateTable('walletRisk')
    .set({
      address: lowerCaseAddress,
      isRisky,
      lastCheck: new Date(),
    })
    .where('address', '=', lowerCaseAddress)
    .execute()
}
