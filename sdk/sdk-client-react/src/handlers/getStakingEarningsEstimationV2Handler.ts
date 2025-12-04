import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'

export const getStakingEarningsEstimationV2Handler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async (params: { stakes: { weightedAmount: bigint }[]; sumrPriceUsd?: number }) => {
    return sdk.armada.users.getStakingEarningsEstimationV2(params)
  }
