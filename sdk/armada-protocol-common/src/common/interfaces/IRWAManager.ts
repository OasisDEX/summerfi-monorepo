import type { ChainId, IRwaVaultInfo } from '@summerfi/sdk-common'

/**
 * @name IRWAManager
 * @description Interface for managing Real-World Asset (RWA) vaults.
 *              Mirrors the relevant subset of IArmadaManagerVaults but is sourced
 *              from the RWA subgraph and returns RWA-specific domain types.
 */
export interface IRWAManager {
  /**
   * @method getVaultInfoListPerChain
   * @description Retrieves the information of all RWA vaults for a given chain and institution
   *
   * @param chainId  Chain to query
   * @param clientId Institution client ID string (e.g. 'ExtDemoCorp_v2')
   *
   * @returns The information of all RWA vaults for the given chain/clientId
   */
  getVaultInfoListPerChain(params: { chainId: ChainId; clientId: string }): Promise<{
    list: IRwaVaultInfo[]
  }>
}
