import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import type { IArmadaPositionId } from '@summerfi/sdk-common'

/**
 * Retrieves deposits for a given Armada position ID with optional pagination
 *
 * @param params.positionId The position ID
 * @param params.first Optional number of items to return
 * @param params.skip Optional number of items to skip for pagination
 */
export const getDepositsHandler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  async ({
    positionId,
    first,
    skip,
  }: {
    positionId: IArmadaPositionId
    first?: number
    skip?: number
  }) => {
    const deposits = await sdk.armada.users.getDeposits({
      positionId,
      first,
      skip,
    })
    return deposits
  }
