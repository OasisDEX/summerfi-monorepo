import { Logger } from '@aws-lambda-powertools/logger'
import { GraphQLClient } from 'graphql-request'
import { Address, ChainId } from '@summerfi/serverless-shared'
import { getRedisInstance } from '@summerfi/redis-cache'
import { DistributedCache } from '@summerfi/abstractions'
import {
  subgraphNameByChainMap as protocolSubgraphNameByChainMap,
  supportedChains as protocolSupportedChains,
} from '@summerfi/summer-earn-protocol-subgraph'
import {
  subgraphNameByChainMap as institutionsSubgraphNameByChainMap,
  supportedChains as institutionsSupportedChains,
} from '@summerfi/summer-earn-institutions-subgraph'
import {
  NavSnapshot,
  NavStaleness,
  computeNavStaleness,
  navChangeAnnualised,
  navPriceChange24h,
} from '../utils/nav-apy'

const logger = new Logger({ serviceName: 'get-protocol-info-function' })

// Cache TTL for the vaults payload. NAV/APY derive from daily snapshots (slow-moving), so a few minutes is
// plenty fresh while keeping TVL reasonably current. Tunable without any other change.
const VAULTS_CACHE_TTL_SECONDS = 300

// New institutional (RWA) v2 subgraphs. These live on the same SUBGRAPH_BASE host as the public/v1 subgraphs.
// NB: the earn-protocol app's `rwaSubgraphsMap` (app/server-handlers/subgraphs-map.ts) currently has the wrong
// `-staging` suffix; the correct names follow the public/v1 pattern (`<name>` / `<name>-base`). This map is the
// corrected source of truth for this function — see CLAUDE.md when adding a new RWA chain.
const rwaSubgraphNameByChainMap: Partial<Record<ChainId, string>> = {
  [ChainId.MAINNET]: 'summer-institutions-v2',
  [ChainId.BASE]: 'summer-institutions-v2-base',
}
const rwaSupportedChains: ChainId[] = Object.keys(rwaSubgraphNameByChainMap).map((k) =>
  parseInt(k),
) as ChainId[]

export type VaultType = 'public' | 'institutional' | 'institutional-v2'

interface VaultSource {
  type: VaultType
  subgraphNameByChainMap: Partial<Record<ChainId, string>>
  supportedChains: ChainId[]
}

const VAULT_SOURCES: VaultSource[] = [
  {
    type: 'public',
    subgraphNameByChainMap: protocolSubgraphNameByChainMap,
    supportedChains: protocolSupportedChains,
  },
  {
    type: 'institutional',
    subgraphNameByChainMap: institutionsSubgraphNameByChainMap,
    supportedChains: institutionsSupportedChains,
  },
  {
    type: 'institutional-v2',
    subgraphNameByChainMap: rwaSubgraphNameByChainMap,
    supportedChains: rwaSupportedChains,
  },
]

// The union of chains any vault source serves. Used to reject `/vaults/{chainId}` for chains that are valid
// `ChainId`s but not served by any vault subgraph (e.g. Optimism/Sepolia), rather than returning a misleading
// empty 200 / 404.
export const supportedVaultChainIds: ChainId[] = Array.from(
  new Set(VAULT_SOURCES.flatMap((source) => source.supportedChains)),
)

// One lean query reused across all three subgraph schemas (they share the core Vault/VaultDailySnapshot
// shape). `first: 8` daily snapshots covers day 0 + the 7 prior days needed for the 7d window. The RWA/v2
// `vaults` root query is intentionally unfiltered here (no institution filter) so it returns every vault
// across institutions in a single call, unlike the typed `GetVaults($institutionId)`.
const VAULTS_NAV_QUERY = /* GraphQL */ `
  query VaultsNav {
    _meta {
      block {
        number
        timestamp
      }
    }
    vaults(first: 1000) {
      id
      name
      pricePerShare
      totalValueLockedUSD
      inputToken {
        symbol
        decimals
      }
      dailySnapshots(first: 8, orderBy: timestamp, orderDirection: desc) {
        pricePerShare
        timestamp
      }
    }
  }
`

// The Graph serialises BigDecimal/BigInt scalars as JSON strings, so numeric fields arrive as strings.
interface SubgraphVault {
  id: string
  name: string | null
  pricePerShare: string | null
  totalValueLockedUSD: string | null
  inputToken: { symbol: string | null; decimals: number } | null
  dailySnapshots: NavSnapshot[] | null
}

interface SubgraphMeta {
  block: {
    number: number
    timestamp: number | null
  }
}

interface VaultsNavQueryResult {
  _meta: SubgraphMeta | null
  vaults: SubgraphVault[]
}

interface VaultApy {
  /** 7-day pricePerShare change, annualised, as a decimal fraction (0.0487 = +4.87%). null when insufficient data. */
  nav7dAnnualised: number | null
  /** 24-hour pricePerShare change (raw, not annualised), as a decimal fraction (0.0003 = +0.03%). null when insufficient data. */
  nav24hChange: number | null
}

export interface VaultInfo {
  chainId: ChainId
  type: VaultType
  vaultAddress: Address
  name: string | null
  inputTokenSymbol: string | null
  /** NAV = pricePerShare, kept as a string to preserve BigDecimal precision. null when the subgraph has no value. */
  nav: string | null
  tvlUSD: number
  apy: VaultApy
  /** Freshness of the NAV data. Consumers MUST check `staleness.isStale` before trusting nav/apy. */
  staleness: NavStaleness
}

export interface VaultsResponseBody {
  vaults: VaultInfo[]
}

function toNumberOrZero(value: string | null | undefined): number {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

function mapVault(
  vault: SubgraphVault,
  chainId: ChainId,
  type: VaultType,
  meta: SubgraphMeta | null,
  nowSeconds: number,
): VaultInfo {
  const snapshots = vault.dailySnapshots ?? []
  return {
    chainId,
    type,
    vaultAddress: vault.id as Address,
    name: vault.name ?? null,
    inputTokenSymbol: vault.inputToken?.symbol ?? null,
    nav: vault.pricePerShare ?? null,
    tvlUSD: toNumberOrZero(vault.totalValueLockedUSD),
    apy: {
      nav7dAnnualised: navChangeAnnualised(snapshots, 7),
      nav24hChange: navPriceChange24h(snapshots),
    },
    staleness: computeNavStaleness({
      snapshots,
      subgraphBlockNumber: meta?.block.number ?? null,
      subgraphBlockTimestamp: meta?.block.timestamp ?? null,
      nowSeconds,
    }),
  }
}

async function fetchVaultsForSource(
  source: VaultSource,
  subgraphBase: string,
  chainFilter?: ChainId,
): Promise<{ vaults: VaultInfo[]; degraded: boolean }> {
  const chains = source.supportedChains.filter(
    (chainId) => chainFilter === undefined || chainId === chainFilter,
  )

  const perChain = await Promise.all(
    chains.map(async (chainId): Promise<{ vaults: VaultInfo[]; failed: boolean }> => {
      const subgraphName = source.subgraphNameByChainMap[chainId]
      if (!subgraphName) {
        return { vaults: [], failed: false }
      }
      const url = `${subgraphBase}/${subgraphName}`
      try {
        const client = new GraphQLClient(url)
        const data = await client.request<VaultsNavQueryResult>(VAULTS_NAV_QUERY)
        // Reference "now" for staleness: the subgraph's latest indexed block timestamp when available,
        // else the Lambda wall clock (fallback handled inside computeNavStaleness).
        const nowSeconds = Math.floor(Date.now() / 1000)
        logger.info('Fetched vaults', {
          source: source.type,
          chainId,
          count: data.vaults.length,
          subgraphBlock: data._meta?.block.number ?? null,
          subgraphBlockTimestamp: data._meta?.block.timestamp ?? null,
        })
        return {
          vaults: data.vaults.map((vault) =>
            mapVault(vault, chainId, source.type, data._meta, nowSeconds),
          ),
          failed: false,
        }
      } catch (error) {
        // Degrade gracefully: a single failing subgraph must not fail the whole response. `failed: true`
        // signals the caller to NOT cache this response, so a transient outage isn't persisted for the TTL.
        logger.warn('Failed to fetch vaults for source/chain', {
          source: source.type,
          chainId,
          error: error instanceof Error ? error.message : String(error),
        })
        return { vaults: [], failed: true }
      }
    }),
  )

  return {
    vaults: perChain.flatMap((result) => result.vaults),
    degraded: perChain.some((result) => result.failed),
  }
}

const NOOP_CACHE: DistributedCache = {
  get: async () => null,
  set: async () => {},
}

let cachedDistributedCache: DistributedCache | undefined = undefined
async function getVaultsCacheInstance(): Promise<DistributedCache> {
  if (cachedDistributedCache !== undefined) {
    return cachedDistributedCache
  }

  const REDIS_CACHE_URL = process.env.REDIS_CACHE_URL
  const REDIS_CACHE_USER = process.env.REDIS_CACHE_USER
  const REDIS_CACHE_PASSWORD = process.env.REDIS_CACHE_PASSWORD
  const STAGE = process.env.STAGE

  if (!REDIS_CACHE_URL || !STAGE) {
    logger.warn('Redis not configured (REDIS_CACHE_URL/STAGE), using noop cache for vaults')
    cachedDistributedCache = NOOP_CACHE
    return cachedDistributedCache
  }

  try {
    cachedDistributedCache = await getRedisInstance(
      {
        url: REDIS_CACHE_URL,
        ttlInSeconds: VAULTS_CACHE_TTL_SECONDS,
        username: REDIS_CACHE_USER,
        password: REDIS_CACHE_PASSWORD,
        stage: STAGE,
      },
      logger,
    )
  } catch (error) {
    // The cache is optional — a Redis connection failure must not take down the endpoint. Fall back to the
    // noop cache (and memoize it so we don't retry connecting on every request in this container).
    logger.warn('Redis init failed, falling back to noop cache for vaults', {
      error: error instanceof Error ? error.message : String(error),
    })
    cachedDistributedCache = NOOP_CACHE
  }
  return cachedDistributedCache
}

/**
 * Fetches all vaults (across public / institutional / institutional-v2 sources), optionally filtered to a
 * single chain. Cached per chain-filter so single-vault lookups reuse the same per-chain list.
 */
async function getAllVaults(subgraphBase: string, chainFilter?: ChainId): Promise<VaultInfo[]> {
  const cache = await getVaultsCacheInstance()
  const cacheKey = `vaults-v1:${chainFilter ?? 'all'}`

  // Cache reads are best-effort: a Redis failure must not fail the request, just fall through to a fresh fetch.
  try {
    const cached = await cache.get(cacheKey)
    if (cached) {
      logger.info('Returning cached vaults', { cacheKey })
      return JSON.parse(cached) as VaultInfo[]
    }
  } catch (error) {
    logger.warn('Cache read failed, fetching fresh', {
      cacheKey,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  const perSource = await Promise.all(
    VAULT_SOURCES.map((source) => fetchVaultsForSource(source, subgraphBase, chainFilter)),
  )
  const vaults = perSource.flatMap((result) => result.vaults)
  const degraded = perSource.some((result) => result.degraded)
  logger.info('Vaults fetched', { total: vaults.length, chainId: chainFilter ?? 'all', degraded })

  // Only persist complete results. If any source degraded, skip the write so a transient outage isn't cached
  // as authoritative for the full TTL (which would also make single-vault lookups 404 for real vaults).
  if (degraded) {
    logger.warn('Skipping cache write due to degraded source(s)', { cacheKey })
  } else {
    try {
      await cache.set(cacheKey, JSON.stringify(vaults))
    } catch (error) {
      logger.warn('Cache write failed', {
        cacheKey,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  return vaults
}

/**
 * `GET /vaults` (all chains) and `GET /vaults/{chainId}` (single chain) — returns the vault list.
 */
export async function handleVaultsListRoute(
  params: { chainId?: ChainId },
  subgraphBase: string,
): Promise<VaultsResponseBody> {
  logger.info('Handling vaults list route', { chainId: params.chainId ?? 'all' })
  const vaults = await getAllVaults(subgraphBase, params.chainId)
  return { vaults }
}

/**
 * `GET /vaults/{chainId}/{vaultAddress}` — returns the single matching vault, or null when not found.
 * Reuses the per-chain cached list and filters by address (case-insensitive).
 */
export async function handleVaultRoute(
  params: { chainId: ChainId; vaultAddress: Address },
  subgraphBase: string,
): Promise<VaultInfo | null> {
  logger.info('Handling single vault route', {
    chainId: params.chainId,
    vaultAddress: params.vaultAddress,
  })
  const vaults = await getAllVaults(subgraphBase, params.chainId)
  const target = params.vaultAddress.toLowerCase()
  return vaults.find((vault) => vault.vaultAddress.toLowerCase() === target) ?? null
}
