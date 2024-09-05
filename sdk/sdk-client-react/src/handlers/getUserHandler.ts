import type { ISDKManager } from '@summerfi/sdk-client'
import type { IAddress, IChainInfo } from '@summerfi/sdk-common'

export const getUserHandler =
  (sdk: ISDKManager) =>
  ({ chainInfo, walletAddress }: { chainInfo: IChainInfo; walletAddress: IAddress }) =>
    sdk.users
      .getUser({
        chainInfo,
        walletAddress,
      })
      .then((chain) => {
        if (!chain) {
          throw new Error('Chain not found')
        }
        return chain
      })
