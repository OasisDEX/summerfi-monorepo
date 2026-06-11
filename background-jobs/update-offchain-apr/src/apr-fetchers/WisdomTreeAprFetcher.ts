import { Product } from '@summerfi/summer-earn-rates-subgraph'
import { ChainId } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { IAprFetcher, OffchainAprRate } from './IAprFetcher'
import { FetcherConfigError } from './errors'

/**
 * Offchain APR fetcher for WisdomTree digital funds (WTGXX, ...).
 *
 * Uses the WisdomTree DataSpan API ("Fund Data APIs" at
 * https://docs.wisdomtreeconnect.com/): plain HTTPS authenticated with an
 * `x-wt-dataspan-key` header. The key is mandatory — without it requests never
 * reach the API (they hit a Cloudflare browser challenge instead).
 *
 * WTGXX is a money market fund whose NAV is pegged at $1.00 — yield is paid as
 * dividend distributions, so NAV carries no rate signal. The `aggregates`
 * endpoint exposes the yield directly as ANNUALIZED metrics expressed as
 * decimal fractions:
 *
 *   GET /funddetails/aggregates/?ticker=WTGXX
 *   → { "dt": "2026-03-13", "metric": "dailyYieldMM", "value": 0.0343, ... }
 *
 * Retry behavior follows the DataSpan integration guide: explicit request
 * timeouts, a single retry after a short backoff, and timeouts / empty-body
 * 5xx responses treated as transient.
 */
export class WisdomTreeAprFetcher implements IAprFetcher {
  /** Stable provider identifier persisted as `offchain_apr.source`. */
  static readonly SOURCE = 'wisdomtree'

  static readonly API_KEY_ENV_VAR = 'WT_DATASPAN_API_KEY'

  private readonly API_BASE_URL = 'https://dataspanapi.wisdomtree.com/funddetails'

  /** DataSpan fund tickers keyed by ERC-20 token symbol (uppercased). */
  private readonly TICKER_BY_SYMBOL: Record<string, string> = {
    WTGXX: 'WTGXX',
  }

  /**
   * Which annualized yield metric to report as the base APR, in preference
   * order. `dailyYieldMM` is the most responsive money-market quote; the
   * 7-day metrics smooth it; `secYield` covers non-money-market funds.
   */
  private readonly METRIC_PREFERENCE = [
    'dailyYieldMM',
    'sevenDayEffYieldMM',
    'sevenDayYieldMM',
    'secYield',
  ]

  private readonly REQUEST_TIMEOUT_MS = 30_000

  private readonly logger: Logger
  private readonly apiKey: string | undefined

  constructor(logger: Logger, apiKey: string | undefined = process.env.WT_DATASPAN_API_KEY) {
    this.logger = logger
    this.apiKey = apiKey
  }

  supportedSymbols(): string[] {
    return Object.keys(this.TICKER_BY_SYMBOL)
  }

  async getAprRates(
    products: Product[],
    chainId: ChainId,
  ): Promise<Record<string, OffchainAprRate>> {
    if (!this.apiKey) {
      throw new FetcherConfigError(
        `WisdomTree DataSpan API key is not configured — set ${WisdomTreeAprFetcher.API_KEY_ENV_VAR}`,
      )
    }

    const results: Record<string, OffchainAprRate> = {}

    // Several products can point at the same fund (same token on different
    // pools/chains); fetch each ticker once per batch.
    const yieldByTicker = new Map<string, Promise<WisdomTreeYieldEntry | null>>()

    for (const product of products) {
      const symbol = product.token.symbol.toUpperCase()
      const ticker = this.TICKER_BY_SYMBOL[symbol]

      if (ticker === undefined) {
        this.logger.warn(
          `[WisdomTreeAprFetcher] No WisdomTree fund mapping for token ${product.token.symbol} (product ${product.id}, chain ${chainId})`,
        )
        continue
      }

      if (!yieldByTicker.has(ticker)) {
        yieldByTicker.set(ticker, this.fetchFundYield(ticker))
      }

      const fundYield = await yieldByTicker.get(ticker)!
      if (!fundYield) continue

      results[product.id] = {
        rate: (fundYield.value * 100).toString(),
        source: WisdomTreeAprFetcher.SOURCE,
        asOf: this.parseAsOfDate(fundYield.dt),
        metadata: {
          ticker,
          symbol,
          metric: fundYield.metric,
          asOfDate: fundYield.dt,
        },
      }
    }

    return results
  }

  private async fetchFundYield(ticker: string): Promise<WisdomTreeYieldEntry | null> {
    try {
      const response = await this.fetchWithRetry(
        `${this.API_BASE_URL}/aggregates/?ticker=${ticker}`,
      )
      const data = (await response.json()) as WisdomTreeYieldEntry | WisdomTreeYieldEntry[]

      const entry = this.pickYieldEntry(data)
      if (!entry) {
        throw new Error(`No usable yield metric in aggregates response: ${JSON.stringify(data)}`)
      }

      return entry
    } catch (error) {
      // Never let one fund break the batch.
      this.logger.error(`[WisdomTreeAprFetcher] Error fetching yield for ticker ${ticker}:`, {
        error: error as Error,
      })
      return null
    }
  }

  /**
   * The aggregates payload may be a single object or an array of metric rows.
   * Pick the preferred metric, taking the most recent row when several exist.
   */
  private pickYieldEntry(
    data: WisdomTreeYieldEntry | WisdomTreeYieldEntry[],
  ): WisdomTreeYieldEntry | null {
    const rows = (Array.isArray(data) ? data : [data]).filter(
      (row) =>
        row &&
        typeof row.metric === 'string' &&
        typeof row.value === 'number' &&
        Number.isFinite(row.value) &&
        typeof row.dt === 'string',
    )

    for (const metric of this.METRIC_PREFERENCE) {
      const candidates = rows.filter((row) => row.metric === metric)
      if (candidates.length > 0) {
        return candidates.reduce((latest, row) => (row.dt > latest.dt ? row : latest))
      }
    }

    return null
  }

  /** `dt` is an ISO day ("2026-03-13"); stamp it as UTC midnight. */
  private parseAsOfDate(dt: string): number {
    const parsed = Date.parse(`${dt}T00:00:00Z`)
    if (Number.isNaN(parsed)) {
      throw new Error(`Unparseable dt: ${dt}`)
    }
    return Math.floor(parsed / 1000)
  }

  /**
   * Single retry after a short backoff, per the DataSpan integration guide
   * ("avoid aggressive retry loops"). Timeouts and 5xx are transient.
   */
  private async fetchWithRetry(url: string): Promise<Response> {
    const maxRetries = 1
    const retryDelayMs = 2000
    let attempt = 0

    while (attempt <= maxRetries) {
      try {
        const response = await fetch(url, {
          headers: { 'x-wt-dataspan-key': this.apiKey! },
          signal: AbortSignal.timeout(this.REQUEST_TIMEOUT_MS),
        })
        if (response.ok) return response
        const text = await response.text()
        throw new Error(`HTTP error! status: ${response.status} ${text}`)
      } catch (error) {
        attempt++
        if (attempt > maxRetries) {
          this.logger.error(`[WisdomTreeAprFetcher] Max retries (${maxRetries}) reached for ${url}`)
          throw error
        }
        this.logger.warn(
          `[WisdomTreeAprFetcher] Attempt ${attempt} failed. Retrying in ${retryDelayMs}ms...`,
        )
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs))
      }
    }
    throw new Error('Unexpected error in fetchWithRetry')
  }
}

interface WisdomTreeYieldEntry {
  dt: string
  metric: string
  value: number
  entityTicker?: string
  aggregateType?: string
}
