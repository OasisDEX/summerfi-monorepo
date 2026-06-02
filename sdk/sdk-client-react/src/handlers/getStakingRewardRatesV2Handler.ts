import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import type { IAddress } from '@summerfi/sdk-common'

export const getStakingRewardRatesV2Handler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  async ({
    rewardTokenAddress,
    sumrPriceUsd,
  }: {
    rewardTokenAddress?: IAddress
    sumrPriceUsd?: number
  }) => {
    return sdk.armada.users.getStakingRewardRatesV2({ rewardTokenAddress, sumrPriceUsd })
  }
