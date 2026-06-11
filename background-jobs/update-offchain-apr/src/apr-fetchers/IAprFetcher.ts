import { Product } from '@summerfi/summer-earn-rates-subgraph'
import { ChainId } from '@summerfi/serverless-shared'

/**
 * A single base-APR observation for a product/ark, sourced from an offchain
 * provider.
 *
 * Unlike reward rates (which are always "now"), an offchain APR is stamped to
 * the date the provider reports it for (`asOf`) — typically a NAV date that can
 * lag the moment we sample it. We persist `asOf` separately from the sampling
 * timestamp so consumers can reason about staleness.
 */
export interface OffchainAprRate {
  /** Base APR as a percentage, e.g. "5.12" for 5.12%. */
  rate: string
  /** Provider identifier this rate came from, for provenance (e.g. "centrifuge"). */
  source: string
  /** Unix seconds the provider reports this rate for (e.g. the NAV date). */
  asOf: number
  /** Optional raw provider data (NAV, maturity, etc.) for debugging/auditing. */
  metadata?: Record<string, unknown>
}

export interface IAprFetcher {
  /**
   * Fetches the base APR for a batch of products on a given chain.
   *
   * Implementations should:
   *  - be resilient (retry/backoff, never throw for a single bad product),
   *  - return an entry only for products they could resolve — products with no
   *    available rate should be omitted (not returned with a zero rate).
   *
   * @param products Products belonging to this fetcher's protocol.
   * @param chainId  Chain the products live on.
   * @returns Map of product id -> base APR observation.
   */
  getAprRates(products: Product[], chainId: ChainId): Promise<Record<string, OffchainAprRate>>
}
