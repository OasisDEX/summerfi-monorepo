import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { type IRwaSubgraphManager, createRwaGraphQLClient } from '@summerfi/subgraph-manager-common'
import { LoggingService, toBytes32InHex, type ChainId, type HexData } from '@summerfi/sdk-common'

/**
 * @name RwaSubgraphManager
 * @implements IRwaSubgraphManager
 */
export class RwaSubgraphManager implements IRwaSubgraphManager {
  private readonly _urlMap: Record<ChainId, { rwa?: string } | undefined>

  /** CONSTRUCTOR */
  constructor(params: { configProvider: IConfigurationProvider }) {
    const envName = 'SDK_SUBGRAPH_CONFIG'
    let urlMap
    try {
      urlMap = JSON.parse(params.configProvider.getConfigurationItem({ name: envName }))
    } catch (error: unknown) {
      throw new Error(`Invalid format of env ${envName} for sdk RWA subgraph config`)
    }
    if (!urlMap) {
      throw new Error('No subgraph config in env')
    }
    LoggingService.log(`Loaded RWA subgraph config from env ${envName}: ${JSON.stringify(urlMap)}`)

    this._urlMap = urlMap
  }

  getVaults({ chainId, clientId }: Parameters<IRwaSubgraphManager['getVaults']>[0]) {
    return this._getClient(chainId).GetVaults({
      institutionId: this._getInstitutionId(clientId),
    })
  }

  getVault({ chainId, vaultId }: Parameters<IRwaSubgraphManager['getVault']>[0]) {
    return this._getClient(chainId).GetVault({ id: vaultId })
  }

  getReceipts({ chainId, account, vault }: Parameters<IRwaSubgraphManager['getReceipts']>[0]) {
    return this._getClient(chainId).GetRwaReceipts({ account, vault })
  }

  getInstitutionById({ chainId, id }: Parameters<IRwaSubgraphManager['getInstitutionById']>[0]) {
    return this._getClient(chainId).GetRwaInstitutionById({
      id: this._getInstitutionId(id),
    })
  }

  /** PRIVATE */
  private _getClient(chainId: ChainId): ReturnType<typeof createRwaGraphQLClient> {
    const urlMapForChain = this._urlMap[chainId]
    if (!urlMapForChain?.rwa) {
      throw new Error(`No RWA subgraph url found for chainId: ${chainId}`)
    }
    return createRwaGraphQLClient(urlMapForChain.rwa)
  }

  private _getInstitutionId(clientId: string): HexData {
    return toBytes32InHex(clientId)
  }
}
