import type { ISDKManager } from '@summerfi/sdk-client'
import { ChainInfo, type IUser } from '@summerfi/sdk-common'

export const getAuthorizeAsMerklRewardsOperatorTxHandler =
  (sdk: ISDKManager) =>
  async ({ user, chainInfo }: { user: IUser; chainInfo: ChainInfo }) => {
    const position = await sdk.armada.users.getAuthorizeAsMerklRewardsOperatorTx({
      user: user.wallet.address.value,
      chainId: chainInfo.chainId,
    })
    return position
  }
