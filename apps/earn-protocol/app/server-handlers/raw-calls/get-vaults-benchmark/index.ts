import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'

export const getVaultsBenchmark = async ({
  networkId,
  asset,
}: {
  networkId: number
  asset: 'USD' | 'ETH'
}): Promise<
  {
    apy1dTotal: string
    timestamp: Date
  }[]
> => {
  const connectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING

  if (!connectionString) {
    throw new Error('Summer Protocol DB Connection string is not set')
  }

  let dbInstance: Awaited<ReturnType<typeof getSummerProtocolDB>> | undefined

  try {
    const { db } = await getSummerProtocolDB({
      connectionString,
    })

    const vaultsBenchmarkData = await db
      .selectFrom('vaultBenchmark')
      .where('chainId', '=', networkId)
      .where('asset', '=', asset)
      .select(['apy1dTotal', 'timestamp'])
      .orderBy('timestamp', 'desc')
      .execute()

    return vaultsBenchmarkData
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching vaults benchmark data:', error)

    return []
  } finally {
    if (dbInstance) {
      await dbInstance.db.destroy().catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error closing database connection (vaults benchmark):', err)
      })
    }
  }
}
