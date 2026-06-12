import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { type IDcaSubgraphManager, createDcaGraphQLClient } from '@summerfi/subgraph-manager-common'
import { LoggingService, type ChainId } from '@summerfi/sdk-common'

/**
 * @name DcaSubgraphManager
 * @implements IDcaSubgraphManager
 */
export class DcaSubgraphManager implements IDcaSubgraphManager {
  private readonly _urlMap: Record<ChainId, { dca?: string } | undefined>

  /** CONSTRUCTOR */
  constructor(params: { configProvider: IConfigurationProvider }) {
    const envName = 'SDK_SUBGRAPH_CONFIG'
    let urlMap
    try {
      urlMap = JSON.parse(params.configProvider.getConfigurationItem({ name: envName }))
    } catch (error: unknown) {
      throw new Error(`Invalid format of env ${envName} for sdk DCA subgraph config`)
    }
    if (!urlMap) {
      throw new Error('No subgraph config in env')
    }
    LoggingService.log(`Creating DCA subgraph`)

    this._urlMap = urlMap
  }

  getStrategies({ chainId }: Parameters<IDcaSubgraphManager['getStrategies']>[0]) {
    return this._getClient(chainId).GetStrategies()
  }

  getExecutions({ chainId, strategyId }: Parameters<IDcaSubgraphManager['getExecutions']>[0]) {
    return this._getClient(chainId).GetExecutions({ strategy_id: strategyId })
  }

  /** PRIVATE */
  private _getClient(chainId: ChainId): ReturnType<typeof createDcaGraphQLClient> {
    const urlMapForChain = this._urlMap[chainId]
    if (!urlMapForChain?.dca) {
      throw new Error(`No DCA subgraph url found for chainId: ${chainId}`)
    }
    return createDcaGraphQLClient(urlMapForChain.dca)
  }
}
