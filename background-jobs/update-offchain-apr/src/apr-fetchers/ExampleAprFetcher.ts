import { Product } from '@summerfi/summer-earn-rates-subgraph'
import { ChainId } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { IAprFetcher, OffchainAprRate } from './IAprFetcher'

/**
 * Reference implementation of an offchain APR fetcher.
 *
 * This is a SCAFFOLD: it documents the shape every real adapter should follow
 * (per-product fetch, retry/backoff, graceful per-product failure, normalize to
 * `OffchainAprRate`) but does not hit a real endpoint — it resolves nothing.
 *
 * To add a real protocol, copy this file, point `PROVIDER_API_URL` /
 * `mapProductToProviderKey` at the provider, and parse its response into
 * `OffchainAprRate`. Then register the fetcher in `apr-service.ts`.
 */
export class ExampleAprFetcher implements IAprFetcher {
  /** Stable provider identifier persisted as `offchain_apr.source`. */
  static readonly SOURCE = 'example'

  // private readonly PROVIDER_API_URL = 'https://api.example.com/nav'
  private readonly REQUEST_DELAY_MS = 100
  private readonly logger: Logger

  constructor(logger: Logger) {
    this.logger = logger
  }

  supportedSymbols(): string[] {
    return []
  }

  async getAprRates(
    products: Product[],
    chainId: ChainId,
  ): Promise<Record<string, OffchainAprRate>> {
    const results: Record<string, OffchainAprRate> = {}

    for (const product of products) {
      try {
        // --- Replace this block with a real provider call, e.g.: ---
        //   const key = this.mapProductToProviderKey(product, chainId)
        //   const res = await this.fetchWithRetry(`${this.PROVIDER_API_URL}/${key}`)
        //   const data = await res.json()
        //   results[product.id] = {
        //     rate: annualizeIfNeeded(data.apr).toString(),
        //     source: ExampleAprFetcher.SOURCE,
        //     asOf: data.navDateUnixSeconds,
        //     metadata: { nav: data.nav, maturity: data.maturity },
        //   }
        this.logger.debug(
          `[ExampleAprFetcher] No-op stub; skipping product ${product.id} on chain ${chainId}`,
        )

        if (products.indexOf(product) < products.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, this.REQUEST_DELAY_MS))
        }
      } catch (error) {
        // Never let one product break the batch.
        this.logger.error(`[ExampleAprFetcher] Error fetching APR for product ${product.id}:`, {
          error: error as Error,
        })
      }
    }

    return results
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          this.logger.error(`[ExampleAprFetcher] Max retries (${maxRetries}) reached for ${url}`)
          throw error
        }
        const delay = initialDelay * Math.pow(backoffFactor, attempt - 1)
        this.logger.warn(
          `[ExampleAprFetcher] Attempt ${attempt} failed. Retrying in ${delay}ms...`,
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
    throw new Error('Unexpected error in fetchWithRetry')
  }
}
