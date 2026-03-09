import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'

export const getVaultsBenchmark = async ({
  networkId,
  asset,
}: {
  networkId: number
  asset: 'USD' | 'ETH'
}): Promise<{
  apy30d: string
  chartData: {
    apy1dTotal: string
    timestamp: Date
  }[]
}> => {
  const connectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING

  if (!connectionString) {
    throw new Error('Summer Protocol DB Connection string is not set')
  }

  let dbInstance: Awaited<ReturnType<typeof getSummerProtocolDB>> | undefined

  try {
    const { db } = await getSummerProtocolDB({
      connectionString,
    })

    const [chartData, apy30d] = await Promise.all([
      db
        .selectFrom('vaultBenchmark')
        .where('chainId', '=', networkId)
        .where('asset', '=', asset)
        .select(['apy1dTotal', 'timestamp'])
        .orderBy('timestamp', 'desc')
        .execute(),
      db
        .selectFrom('vaultBenchmark')
        .where('chainId', '=', networkId)
        .where('asset', '=', asset)
        .select('apy30dTotal')
        .orderBy('timestamp', 'desc')
        .limit(1)
        .executeTakeFirst()
        .then((result) => result?.apy30dTotal ?? '0'),
    ])

    return {
      apy30d,
      chartData,
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching vaults benchmark data:', error)

    return {
      apy30d: '0',
      chartData: [],
    }
  } finally {
    if (dbInstance) {
      await dbInstance.db.destroy().catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error closing database connection (vaults benchmark):', err)
      })
    }
  }
}
