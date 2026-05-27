import type { ChainId, IChainInfo, IRwaVaultInfo } from '@summerfi/sdk-common'
import type { GetVaultsQueryRwa } from '@summerfi/subgraph-manager-common'

/**
 * @name IRwaManagerClient
 * @description Client interface for the RWA namespace
 */
export interface IRwaManagerClient {
  /**
   * @method getVaultInfoListPerChain
   * @description Retrieves all RWA vaults for a given chain and institution clientId
   */
  getVaultInfoListPerChain(params: { chainId: ChainId; clientId: string }): Promise<{
    list: IRwaVaultInfo[]
  }>

  /**
   * @method getVaultsRaw
   * @description Retrieves the raw RWA subgraph GetVaults response for a given chain
   *              and institution clientId. RWA equivalent of armada.users.getVaultsRaw.
   */
  getVaultsRaw(params: { chainInfo: IChainInfo; clientId: string }): Promise<GetVaultsQueryRwa>
}
