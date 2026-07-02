import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import type { IArmadaPositionId } from '@summerfi/sdk-common'

/**
 * Retrieves historical snapshots of a position including hourly, daily, and weekly data
 *
 * @param params.positionId The ID of the position to retrieve history for
 * @returns GetPositionHistoryQuery with position history snapshots
 */
export const getPositionHistoryHandler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  async ({ positionId }: { positionId: IArmadaPositionId }) => {
    const positionHistory = await sdk.armada.users.getPositionHistory({
      positionId,
    })
    return positionHistory
  }
