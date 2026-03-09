// import { type FleetRate } from '@summerfi/app-types'
import { type SummerProtocolDB } from '@summerfi/summer-protocol-db'

const NETWORKS = [
  'arbitrum',
  'base',
  'hyperliquid',
  'mainnet',
  // 'sonic' // sonic not supported :(
] as const
const CODES = ['eth', 'usd'] as const

type Network = (typeof NETWORKS)[number]
type Code = (typeof CODES)[number]

const CHAIN_ID_MAP: { [key in Network]: number } = {
  mainnet: 1,
  arbitrum: 42161,
  base: 8453,
  hyperliquid: 999,
  // sonic: 146,
}

interface ApyPeriod {
  base: number
  reward: number
  total: number
}

interface BenchmarkPoint {
  apy: {
    '1day': ApyPeriod
    '7day': ApyPeriod
    '30day': ApyPeriod
  }
  timestamp: number
}

interface ApiResponse {
  itemsOnPage: number
  nextPage: number | null
  data: BenchmarkPoint[]
}

async function fetchVaultsBenchmarkLatestPoints(
  db: SummerProtocolDB['db'],
  network: Network,
  chainId: number,
  code: Code,
  apiKey: string,
): Promise<BenchmarkPoint[]> {
  const toTimestamp = Math.floor(Date.now() / 1000)
  const latestPoint = await db
    .selectFrom('vaultBenchmark')
    .select(['timestamp'])
    .where('chainId', '=', chainId)
    .where('asset', '=', code.toUpperCase())
    .orderBy('timestamp', 'desc')
    .limit(1)
    .executeTakeFirst()

  // Fallback for first run: keep previous behavior and fetch the recent 23h window.
  const fromTimestamp = latestPoint
    ? Math.floor(new Date(latestPoint.timestamp).getTime() / 1000) + 1
    : Math.floor(Date.now() / 1000) - Number(23 * 3600)

  if (fromTimestamp >= toTimestamp) {
    return []
  }

  const url = `https://api.vaults.fyi/v2/historical-benchmarks/${network}?perPage=1000&code=${code}&fromTimestamp=${fromTimestamp}&toTimestamp=${toTimestamp}`
  const response = await fetch(url, {
    headers: {
      accept: '*/*',
      'x-api-key': apiKey,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${network}/${code}: ${response.status} ${response.statusText}`)
  }

  const json = (await response.json()) as ApiResponse

  return json.data
}

export const updateVaultsBenchmark = async ({ db }: { db: SummerProtocolDB['db'] }) => {
  const startTime = Date.now()
  const { VAULTS_BENCHMARK_API_KEY } = process.env

  if (!VAULTS_BENCHMARK_API_KEY) {
    throw new Error('Missing VAULTS_BENCHMARK_API_KEY')
  }

  const insertUpdatePromises: Promise<{ updated: number; deleted: number }>[] = []

  for (const network of NETWORKS) {
    for (const code of CODES) {
      insertUpdatePromises.push(
        (async () => {
          let updated = 0
          let deleted = 0

          const chainId = CHAIN_ID_MAP[network]
          const points = await fetchVaultsBenchmarkLatestPoints(
            db,
            network,
            chainId,
            code,
            VAULTS_BENCHMARK_API_KEY,
          )

          const rows = points
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            .filter((point) => point.apy !== null)
            .map((point) => {
              return {
                id: `${chainId}-${code}-${point.timestamp}`,
                chainId,
                asset: code.toUpperCase(),
                timestamp: new Date(point.timestamp * 1000),
                apy1dBase: point.apy['1day'].base,
                apy1dReward: point.apy['1day'].reward,
                apy1dTotal: point.apy['1day'].total,
                apy7dBase: point.apy['7day'].base,
                apy7dReward: point.apy['7day'].reward,
                apy7dTotal: point.apy['7day'].total,
                apy30dBase: point.apy['30day'].base,
                apy30dReward: point.apy['30day'].reward,
                apy30dTotal: point.apy['30day'].total,
              }
            })

          if (rows.length !== 0) {
            const insertResult = await db
              .insertInto('vaultBenchmark')
              .values(rows)
              .onConflict((oc) =>
                oc.constraint('vault_benchmark_asset_timestamp_unique').doNothing(),
              )
              .execute()

            for (const result of insertResult) {
              if (result instanceof Error) {
                // eslint-disable-next-line no-console
                console.error(`Failed to insert data for ${network}/${code}:`, result)
              } else {
                updated += Number(result.numInsertedOrUpdatedRows)
              }
            }
          }

          // we keep only the last 3y of data - delete the rest to keep the table clean and performant
          const threeYearsAgo = new Date(Date.now() - Number(3 * 365 * 24 * 3600 * 1000))
          const deleteResult = await db
            .deleteFrom('vaultBenchmark')
            .where('chainId', '=', chainId)
            .where('asset', '=', code.toUpperCase())
            .where('timestamp', '<', threeYearsAgo)
            .execute()

          for (const result of deleteResult) {
            if (result instanceof Error) {
              // eslint-disable-next-line no-console
              console.error(`Failed to delete old data for ${network}/${code}:`, result)
            } else {
              deleted += Number(result.numDeletedRows)
            }
          }

          return { updated, deleted }
        })(),
      )
    }
  }

  const results = await Promise.all(insertUpdatePromises)

  let finalUpdated = 0
  let finalDeleted = 0

  for (const result of results) {
    finalUpdated += result.updated
    finalDeleted += result.deleted
  }

  const endTime = Date.now()
  const duration = `${((endTime - startTime) / 1000).toFixed(2)}s`

  return {
    updated: finalUpdated,
    duration,
    deleted: finalDeleted,
  }
}
