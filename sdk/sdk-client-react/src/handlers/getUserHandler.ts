import type { ISDKManager } from '@summerfi/sdk-client'
import type { IAddress, IChainInfo } from '@summerfi/sdk-common'

export const getUserHandler =
  (sdk: ISDKManager) =>
  async ({ chainInfo, walletAddress }: { chainInfo: IChainInfo; walletAddress: IAddress }) => {
    const chain = await sdk.users.getUser({
      chainInfo,
      walletAddress,
    })
    if (!chain) {
      throw new Error('Chain not found')
    }
    return chain
  }
