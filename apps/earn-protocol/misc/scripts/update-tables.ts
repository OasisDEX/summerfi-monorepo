/**
 * Updates the tables in the database by making a POST request to the local API endpoint.
 *
 * This function sends a request to update multiple tables including latestActivity, topDepositors,
 * and rebalanceActivity. It requires an authorization token from the environment variables.
 *
 * @returns {Promise<void>} A promise that resolves when the tables are updated.
 *
 * @example
 * await updateTables()
 */

import { UpdateTables } from '@/app/server-handlers/tables-data/types'

export const updateTables = async () => {
  const authToken = process.env.EARN_PROTOCOL_UPDATE_TABLES_AUTH_TOKEN

  if (!authToken) {
    throw new Error('EARN_PROTOCOL_UPDATE_TABLES_AUTH_TOKEN is not set')
  }

  const result = await fetch('http://localhost:3000/earn/api/update-tables-data', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tablesToUpdate: [
        UpdateTables.LatestActivity,
        UpdateTables.TopDepositors,
        UpdateTables.RebalanceActivity,
      ],
    }),
  })

  // eslint-disable-next-line no-console
  console.info(`Status: ${result.status}`)
  const data = await result.json()

  // eslint-disable-next-line no-console
  console.info(data)
}

// eslint-disable-next-line no-console
updateTables().catch((e) => console.error(e))
