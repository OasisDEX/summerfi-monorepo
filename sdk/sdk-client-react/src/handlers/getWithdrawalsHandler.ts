import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import type { IArmadaPositionId } from '@summerfi/sdk-common'

/**
 * Retrieves withdrawals for a given Armada position ID with optional pagination
 *
 * @param params.positionId The position ID
 * @param params.first Optional number of items to return
 * @param params.skip Optional number of items to skip for pagination
 */
export const getWithdrawalsHandler =
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
    const withdrawals = await sdk.armada.users.getWithdrawals({
      positionId,
      first,
      skip,
    })
    return withdrawals
  }
