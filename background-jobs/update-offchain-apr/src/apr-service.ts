import { Product } from '@summerfi/summer-earn-rates-subgraph'
import { ChainId } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { IAprFetcher, OffchainAprRate } from './apr-fetchers/IAprFetcher'
import { SuperstateAprFetcher } from './apr-fetchers/SuperstateAprFetcher'
import { WisdomTreeAprFetcher } from './apr-fetchers/WisdomTreeAprFetcher'

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
 */
export class AprService {
  private readonly logger: Logger
  private readonly fetchersByProtocol: Record<string, IAprFetcher>

  constructor(logger: Logger) {
    this.logger = logger

    // Keys must equal the rates-subgraph `Product.protocol` verbatim
    // (case-sensitive): they are used both as the `GetProducts({ protocols })`
    // filter and as the dispatch key in `getAprRates`. `Product.protocol` is the
    // raw `protocol` field from the ark's on-chain details JSON (the same value
    // used as the productId prefix in `getArkProductId`), preserved as-is except
    // for the gearbox->Gearbox / fluid->Fluid remap in the subgraph mapping.
    // `Superstate` / `WisdomTree` are the confirmed details.protocol strings.
    this.fetchersByProtocol = {
      Superstate: new SuperstateAprFetcher(logger),
      WisdomTree: new WisdomTreeAprFetcher(logger),
    }
  }

  /** Protocols that have an offchain APR adapter registered. */
  get protocols(): string[] {
    return Object.keys(this.fetchersByProtocol)
  }

  /** Adapter registered for a protocol, if any. */
  getFetcher(protocol: string): IAprFetcher | undefined {
    return this.fetchersByProtocol[protocol]
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
