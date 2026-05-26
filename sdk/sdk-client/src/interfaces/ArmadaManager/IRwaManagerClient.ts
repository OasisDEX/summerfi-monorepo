import type { ChainId, IRwaVaultInfo } from '@summerfi/sdk-common'

/**
 * @name IRwaManagerClient
 * @description Client interface for the RWA namespace
 */
export interface IRwaManagerClient {
  /**
   * @method getVaultInfoListPerChain
   * @description Retrieves all RWA vaults for a given chain and institution
   */
  getVaultInfoListPerChain(params: { chainId: ChainId; institutionId: string }): Promise<{
    list: IRwaVaultInfo[]
  }>
}
