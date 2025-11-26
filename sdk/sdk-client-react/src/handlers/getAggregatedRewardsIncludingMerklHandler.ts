import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { User, type AddressValue } from '@summerfi/sdk-common'

export const getAggregatedRewardsIncludingMerklHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ userAddress, chainId }: { userAddress: AddressValue; chainId: number }) => {
    const user = User.createFromEthereum(chainId, userAddress)
    return sdk.armada.users.getAggregatedRewardsIncludingMerkl({ user })
  }
