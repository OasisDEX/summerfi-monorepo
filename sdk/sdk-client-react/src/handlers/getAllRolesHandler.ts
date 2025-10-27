import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

/**
 * @name getAllRolesHandler
 * @description Gets all roles for a given chainId with pagination and filtering support
 * @param params.chainId The chain ID to get roles for
 * @param params.first Number of items to return (default: 1000)
 * @param params.skip Number of items to skip for pagination (default: 0)
 * @param params.name Optional role name filter
 * @param params.targetContract Optional target contract address filter
 * @param params.owner Optional owner address filter
 */
export const getAllRolesHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    chainId,
    first,
    skip,
    name,
    targetContract,
    owner,
  }: {
    chainId: ChainId
    first?: number
    skip?: number
    name?: string
    targetContract?: AddressValue
    owner?: AddressValue
  }) => {
    const roles = await sdk.armada.accessControl.getAllRoles({
      chainId,
      first,
      skip,
      name,
      targetContract,
      owner,
    })
    return roles
  }
