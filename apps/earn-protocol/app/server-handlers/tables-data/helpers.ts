import { type Network, type SummerProtocolDB } from '@summerfi/summer-protocol-db'

/**
 * Get the latest timestamp for a given network from the database.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Network} params.network - The network to get the latest timestamp for.
 * @param {SummerProtocolDB['db']} params.db - The database instance.
 *
 * @returns {Promise<string>} The latest timestamp for the given network.
 */
export const getLatestTimestamp = async ({
  network,
  db,
  table,
}: {
  network: Network
  db: SummerProtocolDB['db']
  table: 'latestActivity' | 'rebalanceActivity'
}): Promise<string> => {
  const latestTimestamp = await db
    .selectFrom(table)
    .selectAll()
    .orderBy('timestamp', 'desc')
    .where('network', '=', network)
    .limit(1)
    .execute()

  // Get the most recent timestamp from the database, or 0 if no records exist
  return latestTimestamp[0]?.timestamp || '0'
}
