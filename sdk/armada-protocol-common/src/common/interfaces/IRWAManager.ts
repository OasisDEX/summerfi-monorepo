import type { ChainId, IArmadaVaultId, IChainInfo, IRwaVaultInfo } from '@summerfi/sdk-common'
import type { GetVaultQueryRwa, GetVaultsQueryRwa } from '@summerfi/subgraph-manager-common'

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

  /**
   * @method getVaultsRaw
   * @description Retrieves the raw RWA subgraph response for all vaults of a given chain
   *              and institution. This is the RWA equivalent of
   *              IArmadaManagerPositions.getVaultsRaw.
   *
   * @param chainInfo Chain to query
   * @param clientId  Institution client ID string (e.g. 'ExtDemoCorp_v2')
   *
   * @returns The raw GetVaults query result from the RWA subgraph
   */
  getVaultsRaw(params: { chainInfo: IChainInfo; clientId: string }): Promise<GetVaultsQueryRwa>

  /**
   * @method getVaultRaw
   * @description Retrieves the raw RWA subgraph response for a single vault. This is the RWA
   *              equivalent of IArmadaManagerPositions.getVaultRaw.
   *
   * @param vaultId Identifier of the vault to query (chain + fleet address)
   *
   * @returns The raw GetVault query result from the RWA subgraph
   */
  getVaultRaw(params: { vaultId: IArmadaVaultId }): Promise<GetVaultQueryRwa>
}
