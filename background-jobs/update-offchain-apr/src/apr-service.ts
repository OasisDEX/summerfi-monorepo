import { Product } from '@summerfi/summer-earn-rates-subgraph'
import { ChainId } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { IAprFetcher, OffchainAprRate } from './apr-fetchers/IAprFetcher'

/**
 * Registry / dispatcher for offchain APR fetchers, mirroring `RewardsService`
 * in the rewards job.
 *
 * Each entry maps a subgraph `protocol` string to the adapter responsible for
 * resolving that protocol's base APR offchain. Adding support for a new
 * institutional RWA protocol is a one-line change here:
 *
 *   this.fetchersByProtocol = {
 *     [SomeProtocol]: new SomeAprFetcher(logger),
 *   }
 *
 * The map is intentionally EMPTY by default — until a real adapter is wired in,
 * `protocols` is empty and the handler queries no products, so the job is a
 * safe no-op.
 */
export class AprService {
  private readonly logger: Logger
  private readonly fetchersByProtocol: Record<string, IAprFetcher>

  constructor(logger: Logger) {
    this.logger = logger

    // TODO: register real adapters here once we pick the first protocol, e.g.
    //   'Centrifuge': new CentrifugeAprFetcher(logger),
    this.fetchersByProtocol = {}
  }

  /** Protocols that have an offchain APR adapter registered. */
  get protocols(): string[] {
    return Object.keys(this.fetchersByProtocol)
  }

  /**
   * Resolves base APRs for the given products by routing each protocol group to
   * its adapter. Products whose protocol has no adapter, or that the adapter
   * could not resolve, are simply absent from the result.
   */
  async getAprRates(
    products: Product[],
    chainId: ChainId,
  ): Promise<Record<string, OffchainAprRate>> {
    this.logger.debug(
      `[AprService] Getting offchain APR for ${products.length} products on chain ${chainId}`,
    )

    const protocolGroups = products.reduce<Record<string, Product[]>>((acc, product) => {
      const protocol = product.protocol
      acc[protocol] = acc[protocol] || []
      acc[protocol].push(product)
      return acc
    }, {})

    const results: Record<string, OffchainAprRate> = {}

    for (const [protocol, group] of Object.entries(protocolGroups)) {
      const fetcher = this.fetchersByProtocol[protocol]
      if (!fetcher) {
        this.logger.warn(`[AprService] No offchain APR fetcher registered for protocol ${protocol}`)
        continue
      }

      try {
        const protocolResults = await fetcher.getAprRates(group, chainId)
        Object.assign(results, protocolResults)
      } catch (error) {
        this.logger.error(`[AprService] Error fetching offchain APR for protocol ${protocol}:`, {
          error: error as Error,
        })
      }
    }

    return results
  }
}
