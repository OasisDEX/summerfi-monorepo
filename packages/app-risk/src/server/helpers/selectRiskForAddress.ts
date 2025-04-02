import type { Kysely } from 'kysely'

import type { RiskRequiredDB } from '@/types'

/**
 * Select the risk record for a given address from the database.
 *
 * This function queries the `walletRisk` table to retrieve the risk data associated with the provided address.
 * The address is converted to lowercase before querying to ensure case-insensitive matching.
 *
 * @param db - The Kysely database instance.
 * @param address - The address to select the risk record for.
 * @returns A promise that resolves to the risk data object for the address if found, otherwise undefined.
 */
export const selectRiskForAddress = async ({
  db,
  address,
}: {
  db: Kysely<RiskRequiredDB>
  address: string
}): Promise<{
  address: string
  isRisky: boolean
  lastCheck: Date
}> => {
  const data = await db
    .selectFrom('walletRisk')
    .where('address', '=', address.toLowerCase())
    .selectAll()
    .limit(1)
    .execute()

  return data[0]
}
