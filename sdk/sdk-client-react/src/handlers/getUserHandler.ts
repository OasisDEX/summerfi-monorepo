import type { ISDKManager } from '@summerfi/sdk-client'
import type { IAddress, IChainInfo } from '@summerfi/sdk-common'

export const getUserHandler =
  (sdk: ISDKManager, chainInfo?: IChainInfo) =>
  async ({ walletAddress }: { walletAddress: IAddress }) => {
    if (!chainInfo) {
      throw new Error('ChainId is not defined')
    }
    const chain = await sdk.users.getUser({
      chainInfo,
      walletAddress,
    })
    if (!chain) {
      throw new Error('Chain not found')
    }
    return chain
  }
