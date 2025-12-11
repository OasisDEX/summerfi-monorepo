import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'

export const getStakingEarningsEstimationV2Handler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async (params: { stakes: { weightedAmount: bigint; id: string }[] }) => {
    const stakes = params.stakes.map((stake) => ({
      id: stake.id,
      weightedAmount: stake.weightedAmount.toString(),
    }))

    return sdk.armada.users.getStakingEarningsEstimationV2({
      stakes,
    })
  }
