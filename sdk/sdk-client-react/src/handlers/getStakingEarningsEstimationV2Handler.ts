import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue } from '@summerfi/sdk-common'

export const getStakingEarningsEstimationV2Handler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async (params: {
    stakes: { amount: bigint; period: bigint; weightedAmount: bigint }[]
    sumrPriceUsd?: number
    userAddress: AddressValue
  }) => {
    return sdk.armada.users.getStakingEarningsEstimationV2(params)
  }
