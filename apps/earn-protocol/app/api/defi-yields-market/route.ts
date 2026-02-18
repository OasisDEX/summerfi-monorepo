/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-console */
import { type NextRequest, NextResponse } from 'next/server'

type DefillamaPoolsResponse = {
  status: string
  data: {
    chain: string
    project: string
    symbol: string
    tvlUsd: number
    apyBase: number | null
    apyReward: number | null
    apy: number
    rewardTokens: string[] | null
    pool: string
    apyPct1D: number
    apyPct7D: number
    apyPct30D: number
    stablecoin: boolean
    ilRisk: string
    exposure: string
    predictions: {
      predictedClass: string
      predictedProbability: number
      binnedConfidence: number
    }
    poolMeta: string | null
    mu: number
    sigma: number
    count: number
    outlier: boolean
    underlyingTokens: string[]
    il7d: number | null
    apyBase7d: number | null
    apyMean30d: number | null
    volumeUsd1d: number | null
    volumeUsd7d: number | null
    apyBaseInception: number | null
  }[]
}

// Simple in-memory cache (single container)
const cache: {
  projects: { [key: string]: { tvl: number; timestamp: number } | undefined }
  pools: { data?: DefillamaPoolsResponse['data']; timestamp?: number }
} = {
  projects: {},
  pools: {},
}
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

const isCacheExpired = (timestamp?: number) => !timestamp || Date.now() - timestamp > CACHE_TTL

const getProjectCache = (projectId: string) => {
  const cached = cache.projects[projectId]

  return cached && !isCacheExpired(cached.timestamp) ? cached : undefined
}

const setProjectCache = (projectId: string, tvl: number) => {
  cache.projects[projectId] = {
    tvl,
    timestamp: Date.now(),
  }
}

const getPoolsCache = () => {
  const cached = cache.pools

  return cached.data && !isCacheExpired(cached.timestamp) ? cached.data : undefined
}

const setPoolsCache = (data: DefillamaPoolsResponse['data']) => {
  cache.pools.data = data
  cache.pools.timestamp = Date.now()
}

export async function GET(request: NextRequest) {
  console.time('Fetching TVL and pools data')
  const searchParams = Object.fromEntries(request.nextUrl.searchParams)
  const { projectId } = searchParams

  if (!projectId) {
    return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 })
  }

  console.log('Got request for project ID:', projectId)

  const cachedProject = getProjectCache(projectId)

  try {
    let projectTvl: number

    if (cachedProject) {
      projectTvl = cachedProject.tvl
    } else {
      const projectResponseRaw = await fetch(`https://api.llama.fi/tvl/${projectId}`)

      if (!projectResponseRaw.ok) {
        console.timeEnd('Fetching TVL and pools data')

        return NextResponse.json(
          { error: `Failed to fetch TVL for project ${projectId}` },
          { status: 500 },
        )
      }

      projectTvl = (await projectResponseRaw.json()) as number

      if (typeof projectTvl === 'number' && projectTvl > 0) {
        setProjectCache(projectId, projectTvl)
      }
    }

    let poolsData = getPoolsCache()

    if (!poolsData) {
      console.log('Pools cache is empty or expired. Fetching new pools data from DefiLlama...')
      const poolsResponseRaw = await fetch('https://yields.llama.fi/pools')

      if (!poolsResponseRaw.ok) {
        console.timeEnd('Fetching TVL and pools data')

        return NextResponse.json(
          { error: 'Failed to fetch pools data from DefiLlama' },
          { status: 500 },
        )
      }
      const poolsResponse = (await poolsResponseRaw.json()) as DefillamaPoolsResponse

      poolsData = poolsResponse.data
      setPoolsCache(poolsData)
    }
    const projectPools = poolsData
      .filter((poolDataProject) =>
        projectId.toLowerCase().includes(poolDataProject.project.toLowerCase()),
      )
      .filter((pool) => pool.tvlUsd > 0)
      .filter((pool) => pool.apy > 0.1)
      .sort((a, b) => (b.tvlUsd || 0) - (a.tvlUsd || 0))
      .map((pool) => ({
        tvlUsd: pool.tvlUsd,
        symbol: pool.symbol,
        apy: pool.apy,
        chain: pool.chain,
        pool: pool.pool,
      }))
      .slice(0, 6)
    const projectAvgApy =
      projectPools && projectPools.length > 0
        ? projectPools.reduce((sum, p) => sum + (p.apy || 0), 0) / projectPools.length
        : null

    console.timeEnd('Fetching TVL and pools data')

    return NextResponse.json({
      tvl: projectTvl,
      avgApy: projectAvgApy,
      pools: projectPools,
    })
  } catch (error) {
    console.timeEnd('Fetching TVL and pools data')

    return NextResponse.json(
      { error: `An error occurred while fetching TVL for project ${projectId}` },
      { status: 500 },
    )
  }
}
