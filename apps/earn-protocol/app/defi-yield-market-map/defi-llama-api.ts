// DefiLlama API functions — isolated for easy replacement with a custom server call later

export interface DefiLlamaPool {
  pool: string
  chain: string
  project: string
  symbol: string
  tvlUsd: number
  apy: number
}

export interface ProtocolModalData {
  tvl: number | null
  avgApy: number | null
  pools: DefiLlamaPool[]
}

const TVL_SLUGS: { [key: string]: string[] } = {
  silo: ['silo-v2', 'silo-finance', 'silo'],
  'trader-joe': ['joe-v2', 'trader-joe'],
  'idle-finance': ['idle', 'idle-finance'],
  'neutra-finance': ['neutra-finance', 'neutra'],
  'coinbase-wrapped-staked-eth': ['coinbase-wrapped-staked-eth', 'cbeth'],
  'frax-ether': ['frax-ether', 'frax'],
  'velodrome-v2': ['velodrome-v2', 'velodrome'],
  'puffer-finance': ['puffer-finance', 'puffer'],
  'kelp-dao': ['kelp-dao', 'kelpdao'],
  'kamino-lend': ['kamino-lend', 'kamino'],
  'marinade-finance': ['marinade-finance', 'marinade'],
  'yearn-finance': ['yearn-finance', 'yearn'],
  'convex-finance': ['convex-finance', 'convex'],
  'term-finance': ['term-finance', 'term'],
  'yo-protocol': ['yo-protocol', 'yo'],
  'felix-protocol': ['felix-protocol', 'felix'],
  'curve-dex': ['curve-dex', 'curve-finance', 'curve'],
  'rocket-pool': ['rocket-pool', 'rocketpool'],
}

const POOL_SLUGS: { [key: string]: string[] } = {
  silo: ['silo-v2', 'silo-finance', 'silo'],
  'trader-joe': ['joe-v2', 'trader-joe'],
  'idle-finance': ['idle', 'idle-finance'],
  'velodrome-v2': ['velodrome-v2', 'velodrome'],
  'curve-dex': ['curve-dex', 'curve'],
  'rocket-pool': ['rocket-pool', 'rocketpool'],
  'ether.fi': ['ether.fi', 'etherfi'],
  'coinbase-wrapped-staked-eth': ['coinbase-wrapped-staked-eth', 'cbeth'],
  'frax-ether': ['frax-ether', 'frax-eth'],
}

let poolsCache: DefiLlamaPool[] | null = null
let poolsFetchPromise: Promise<DefiLlamaPool[]> | null = null

function fetchAllPools(): Promise<DefiLlamaPool[]> {
  if (poolsCache) return Promise.resolve(poolsCache)
  if (poolsFetchPromise) return poolsFetchPromise

  poolsFetchPromise = fetch('https://yields.llama.fi/pools')
    .then((r) => r.json())
    .then((d) => {
      poolsCache = (d.data as DefiLlamaPool[]) || []

      return poolsCache
    })
    .catch(() => {
      poolsCache = []

      return []
    })

  return poolsFetchPromise
}

async function fetchTVL(slug: string): Promise<number | null> {
  const slugsToTry = slug in TVL_SLUGS ? TVL_SLUGS[slug] : [slug]

  for (const s of slugsToTry) {
    try {
      const r = await fetch(`https://api.llama.fi/tvl/${s}`)
      const v = await r.json()

      if (typeof v === 'number' && v > 0) return v
    } catch {
      // try next slug
    }
  }

  return null
}

function getProtocolPools(slug: string): DefiLlamaPool[] {
  if (!poolsCache) return []

  const slugsToTry = slug in POOL_SLUGS ? POOL_SLUGS[slug] : [slug]
  let matched: DefiLlamaPool[] = []

  for (const s of slugsToTry) {
    const found = poolsCache.filter((p) => p.project === s)

    if (found.length > matched.length) matched = found
  }

  matched.sort((a, b) => (b.tvlUsd || 0) - (a.tvlUsd || 0))

  return matched.slice(0, 6)
}

/**
 * Fetch protocol modal data from DefiLlama.
 * This function is the single entry point so it can be easily replaced
 * with a custom server call later.
 */
export async function fetchProtocolModalData(slug: string): Promise<ProtocolModalData> {
  const [tvl] = await Promise.all([fetchTVL(slug), fetchAllPools()])
  const pools = getProtocolPools(slug)

  let avgApy: number | null = null

  if (pools.length > 0) {
    const sum = pools.reduce((s, p) => s + (p.apy || 0), 0)

    avgApy = sum / pools.length
  }

  return { tvl, avgApy, pools }
}
