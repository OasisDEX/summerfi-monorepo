import type { ChainId } from '@summerfi/sdk-common'
import type {
  GetVaultQuery,
  GetVaultsQuery,
  GetRwaReceiptsQuery,
  GetRwaInstitutionByIdQuery,
} from '../generated/rwa/client'
import type { IArmadaSubgraphManager } from './IArmadaSubgraphManager'

/**
 * @name IRwaSubgraphManager
 * @description Interface for the RWA subgraph manager
 */
export interface IRwaSubgraphManager extends IArmadaSubgraphManager {
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

  /**
   * @name getReceipts
   * @description Get all non-zero RoundsVault ERC-1155 receipt balances held by an account in a given
   *              RoundsVault, on a given chain.
   *
   * @param chainId target chain
   * @param account the holder address (lowercased hex string)
   * @param vault the RoundsVault contract address (lowercased hex string)
   *
   * @returns GetRwaReceiptsQuery
   *
   * @throws Error
   */
  getReceipts(params: {
    chainId: ChainId
    account: string
    vault: string
  }): Promise<GetRwaReceiptsQuery>

  /**
   * @name getInstitutionById
   * @description Get a specific institution's contract wiring (configurationManager,
   *              protocolAccessManager, admiralsQuarters, harborCommand) by client id on a given chain.
   *              The clientId is encoded to a bytes32 institutionId internally before being passed to
   *              the subgraph (mirrors getVaults).
   *
   * @param chainId target chain
   * @param id institution client ID string (e.g. 'ExtDemoCorp_v2')
   *
   * @returns GetRwaInstitutionByIdQuery
   *
   * @throws Error
   */
  getInstitutionById(params: { chainId: ChainId; id: string }): Promise<GetRwaInstitutionByIdQuery>
}
