import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'

export const getStakingEarningsEstimationV2Handler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  async (params: { stakes: { weightedAmount: bigint; id: string }[] }) => {
    const stakes = params.stakes.map((stake) => ({
      id: stake.id,
      weightedAmount: stake.weightedAmount.toString(),
    }))

    return sdk.armada.users.getStakingEarningsEstimationV2({
      stakes,
    })
  }
