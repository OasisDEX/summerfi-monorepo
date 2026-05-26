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
   * @param chainId       Chain to query
   * @param institutionId Institution ID owning the vaults
   *
   * @returns The information of all RWA vaults for the given chain/institution
   */
  getVaultInfoListPerChain(params: { chainId: ChainId; institutionId: string }): Promise<{
    list: IRwaVaultInfo[]
  }>
}
