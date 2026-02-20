import { type DYMProtocolModalData } from '@/app/defi-yield-market-map/types'

const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours
const protocolCache: {
  [key: string]: (DYMProtocolModalData & { timestamp: number }) | undefined
} = {}

const isCacheExpired = (timestamp?: number) => !timestamp || Date.now() - timestamp > CACHE_TTL

const setProtocolCache = (
  slug: string,
  data: { tvl: number; avgApy: number; pools: DYMProtocolModalData['pools'] },
) => {
  protocolCache[slug] = {
    ...data,
    timestamp: Date.now(),
  }
}

export async function fetchProtocolModalData(slug: string): Promise<DYMProtocolModalData> {
  if (!slug) {
    return { tvl: null, avgApy: null, pools: [] }
  }
  const cached = protocolCache[slug]

  if (cached && !isCacheExpired(cached.timestamp)) {
    return {
      tvl: cached.tvl,
      avgApy: cached.avgApy,
      pools: cached.pools,
    }
  }

  const response = await fetch(`/earn/api/defi-yields-market?projectId=${slug}`)

  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error(`Failed to fetch data for ${slug}: ${response.statusText}`)

    return { tvl: null, avgApy: null, pools: [] }
  }

  const data = (await response.json()) as DYMProtocolModalData

  setProtocolCache(slug, {
    tvl: data.tvl ?? 0,
    avgApy: data.avgApy ?? 0,
    pools: data.pools,
  })

  return { tvl: data.tvl ?? 0, avgApy: data.avgApy ?? 0, pools: data.pools }
}
