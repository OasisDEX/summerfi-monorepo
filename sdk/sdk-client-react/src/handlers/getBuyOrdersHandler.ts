import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { getChainInfoByChainId, type AddressValue, type ChainId, User } from '@summerfi/sdk-common'

export const getBuyOrdersHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    userAddress,
    chainId,
    status,
  }: {
    userAddress: AddressValue
    chainId: ChainId
    status?: 'active' | 'cancelled'
  }) => {
    const user = User.createFromEthereum(chainId, userAddress)

    return sdk.armada.dca.getBuyOrders({
      user,
      chainInfo: getChainInfoByChainId(chainId),
      status,
    })
  }
