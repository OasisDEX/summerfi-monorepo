import type { ChainId } from '@summerfi/sdk-common'
import type { GetVaultQuery, GetVaultsQuery } from '../generated/rwa/client'

/**
 * @name IRwaSubgraphManager
 * @description Interface for the RWA subgraph manager
 */
export interface IRwaSubgraphManager {
  /**
   * @name getVaults
   * @description Get all RWA vaults for a given institution on a given chain.
   *              The clientId is encoded to a bytes32 institutionId internally before
   *              being passed to the subgraph (mirrors ArmadaSubgraphManager).
   *
   * @param chainId target chain
   * @param clientId institution client ID string (e.g. 'ExtDemoCorp_v2');
   *
   * @returns GetVaultsQuery
   *
   * @throws Error
   */
  getVaults(params: { chainId: ChainId; clientId: string }): Promise<GetVaultsQuery>

  /**
   * @name getVault
   * @description Get a specific RWA vault by id on a given chain
   *
   * @param chainId target chain
   * @param vaultId target vault id
   *
   * @returns GetVaultQuery
   *
   * @throws Error
   */
  getVault(params: { chainId: ChainId; vaultId: string }): Promise<GetVaultQuery>
}
