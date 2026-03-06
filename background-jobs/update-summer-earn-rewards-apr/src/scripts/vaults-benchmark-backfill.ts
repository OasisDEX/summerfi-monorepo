import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import * as fs from 'fs'
import * as path from 'path'

const NETWORKS = [
  'arbitrum',
  'base',
  'hyperliquid',
  'mainnet',
  // 'sonic' // sonic not supported :(
] as const
const CODES = ['eth', 'usd'] as const
const CACHE_DIR = path.join(__dirname, '.backfill-cache')

type Network = (typeof NETWORKS)[number]
type Code = (typeof CODES)[number]

const CHAIN_ID_MAP: Record<Network, number> = {
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

function getCachePath(network: Network, code: Code): string {
  return path.join(CACHE_DIR, `${network}-${code}.json`)
}

async function fetchWithCache(
  network: Network,
  code: Code,
  apiKey: string,
): Promise<BenchmarkPoint[]> {
  const cachePath = getCachePath(network, code)

  if (fs.existsSync(cachePath)) {
    console.log(`[cache hit] ${network}/${code}`)
    return JSON.parse(fs.readFileSync(cachePath, 'utf-8')) as BenchmarkPoint[]
  }

  console.log(`[fetching] ${network}/${code}`)
  const url = `https://api.vaults.fyi/v2/historical-benchmarks/${network}?perPage=1000&code=${code}`
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

  fs.mkdirSync(CACHE_DIR, { recursive: true })
  fs.writeFileSync(cachePath, JSON.stringify(json.data, null, 2))
  console.log(`[cached] ${network}/${code} — ${json.data.length} points`)

  return json.data
}

async function main() {
  const { EARN_PROTOCOL_DB_CONNECTION_STRING, VAULTS_FYI_API_KEY } = process.env

  if (!EARN_PROTOCOL_DB_CONNECTION_STRING) {
    throw new Error('Missing EARN_PROTOCOL_DB_CONNECTION_STRING')
  }
  if (!VAULTS_FYI_API_KEY) {
    throw new Error('Missing VAULTS_FYI_API_KEY')
  }

  const { db } = await getSummerProtocolDB({
    connectionString: EARN_PROTOCOL_DB_CONNECTION_STRING,
  })

  for (const network of NETWORKS) {
    for (const code of CODES) {
      const points = await fetchWithCache(network, code, VAULTS_FYI_API_KEY)
      const chainId = CHAIN_ID_MAP[network]

      const rows = points
        .filter((point) => !!point.apy)
        .map((point) => {
          return {
            id: `${chainId}-${code}-${point.timestamp}`,
            chainId: chainId,
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

      if (rows.length === 0) {
        console.log(`[skipped] ${network}/${code} — no data`)
        continue
      }

      await db
        .insertInto('vaultBenchmark')
        .values(rows)
        .onConflict((oc) => oc.constraint('vault_benchmark_asset_timestamp_unique').doNothing())
        .execute()

      console.log(`[inserted] ${network}/${code} — ${rows.length} rows`)
    }
  }

  console.log('Backfill complete.')
  process.exit(0)
}

main()
