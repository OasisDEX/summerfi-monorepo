import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { IAddress } from '@summerfi/sdk-common'

export const getStakingRewardRatesV2Handler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    rewardTokenAddress,
    sumrPriceUsd,
  }: {
    rewardTokenAddress: IAddress
    sumrPriceUsd?: number
  }) => {
    return sdk.armada.users.getStakingRewardRatesV2({ rewardTokenAddress, sumrPriceUsd })
  }
