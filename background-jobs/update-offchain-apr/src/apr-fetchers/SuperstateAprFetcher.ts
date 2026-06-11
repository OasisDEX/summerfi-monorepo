import { Product } from '@summerfi/summer-earn-rates-subgraph'
import { ChainId } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { IAprFetcher, OffchainAprRate } from './IAprFetcher'

/**
 * Offchain APR fetcher for Superstate institutional RWA funds (USTB, USCC).
 *
 * Superstate exposes public, unauthenticated fund endpoints (the authenticated
 * Balances API only reports holdings, not yield):
 *
 *   GET https://api.superstate.com/v1/funds/{fundId}/yield
 *   → { "as_of_date": "2026-06-09", "thirty_day": 0.0357, "seven_day": ..., "one_day": ... }
 *
 * The yields are ANNUALIZED trailing rates expressed as decimal fractions
 * (verified against /v1/funds/{id}/nav-daily: day-over-day NAV drift × 365
 * matches `one_day`). We report `thirty_day` as the base APR: NAV is struck
 * once per business day, and for USCC (crypto carry) the 1d/7d windows are
 * noisy and can go negative, while the 30-day window reflects the realized
 * run-rate. The shorter windows are kept in `metadata` for auditing.
 *
 * Products map to funds by token symbol; both funds share one fund-level rate
 * regardless of chain (the tokens are multi-chain, the NAV is not).
 */
export class SuperstateAprFetcher implements IAprFetcher {
  /** Stable provider identifier persisted as `offchain_apr.source`. */
  static readonly SOURCE = 'superstate'

  private readonly API_BASE_URL = 'https://api.superstate.com/v1/funds'

  /** Superstate fund ids keyed by ERC-20 token symbol (uppercased). */
  private readonly FUND_ID_BY_SYMBOL: Record<string, number> = {
    USTB: 1,
    USCC: 2,
  }

  private readonly logger: Logger

  constructor(logger: Logger) {
    this.logger = logger
  }

  supportedSymbols(): string[] {
    return Object.keys(this.FUND_ID_BY_SYMBOL)
  }

  async getAprRates(
    products: Product[],
    chainId: ChainId,
  ): Promise<Record<string, OffchainAprRate>> {
    const results: Record<string, OffchainAprRate> = {}

    // Several products can point at the same fund (same token on different
    // pools); fetch each fund once per batch.
    const yieldByFundId = new Map<number, Promise<SuperstateFundYield | null>>()

    for (const product of products) {
      const symbol = product.token.symbol.toUpperCase()
      const fundId = this.FUND_ID_BY_SYMBOL[symbol]

      if (fundId === undefined) {
        this.logger.warn(
          `[SuperstateAprFetcher] No Superstate fund mapping for token ${product.token.symbol} (product ${product.id}, chain ${chainId})`,
        )
        continue
      }

      if (!yieldByFundId.has(fundId)) {
        yieldByFundId.set(fundId, this.fetchFundYield(fundId))
      }

      const fundYield = await yieldByFundId.get(fundId)!
      if (!fundYield) continue

      results[product.id] = {
        rate: (fundYield.thirty_day * 100).toString(),
        source: SuperstateAprFetcher.SOURCE,
        asOf: this.parseAsOfDate(fundYield.as_of_date),
        metadata: {
          fundId,
          symbol,
          asOfDate: fundYield.as_of_date,
          sevenDay: fundYield.seven_day,
          oneDay: fundYield.one_day,
        },
      }
    }

    return results
  }

  private async fetchFundYield(fundId: number): Promise<SuperstateFundYield | null> {
    try {
      const response = await this.fetchWithRetry(`${this.API_BASE_URL}/${fundId}/yield`)
      const data = (await response.json()) as SuperstateFundYield

      if (typeof data.thirty_day !== 'number' || !Number.isFinite(data.thirty_day)) {
        throw new Error(`Malformed yield response: ${JSON.stringify(data)}`)
      }

      return data
    } catch (error) {
      // Never let one fund break the batch.
      this.logger.error(`[SuperstateAprFetcher] Error fetching yield for fund ${fundId}:`, {
        error: error as Error,
      })
      return null
    }
  }

  /** `as_of_date` is an ISO day ("2026-06-09"); stamp it as UTC midnight. */
  private parseAsOfDate(asOfDate: string): number {
    const parsed = Date.parse(`${asOfDate}T00:00:00Z`)
    if (Number.isNaN(parsed)) {
      throw new Error(`Unparseable as_of_date: ${asOfDate}`)
    }
    return Math.floor(parsed / 1000)
  }

  private async fetchWithRetry(url: string, options?: RequestInit): Promise<Response> {
    const maxRetries = 5
    const initialDelay = 2000
    const backoffFactor = 2
    let attempt = 0

    while (attempt <= maxRetries) {
      try {
        const response = await fetch(url, options)
        if (response.ok) return response
        const text = await response.text()
        throw new Error(`HTTP error! status: ${response.status} ${text}`)
      } catch (error) {
        attempt++
        if (attempt > maxRetries) {
          this.logger.error(`[SuperstateAprFetcher] Max retries (${maxRetries}) reached for ${url}`)
          throw error
        }
        const delay = initialDelay * Math.pow(backoffFactor, attempt - 1)
        this.logger.warn(
          `[SuperstateAprFetcher] Attempt ${attempt} failed. Retrying in ${delay}ms...`,
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
    throw new Error('Unexpected error in fetchWithRetry')
  }
}

interface SuperstateFundYield {
  as_of_date: string
  thirty_day: number
  seven_day: number
  one_day: number
}
