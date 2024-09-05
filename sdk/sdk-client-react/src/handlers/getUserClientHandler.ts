import { type ISDKManager } from '@summerfi/sdk-client'
import { Address } from '@summerfi/sdk-common'

export const getUserClientHandler =
  (sdk: ISDKManager) =>
  async ({ chainId, walletAddress }: { chainId: number; walletAddress: string }) => {
    const chain = await sdk.chains.getChainById({
      chainId,
    })

    if (!chain) {
      throw new Error('Chain not found')
    }
    const user = await sdk.users
      .getUser({
        chainInfo: chain.chainInfo,
        walletAddress: Address.createFromEthereum({ value: walletAddress }),
      })
      .catch((error) => {
        throw new Error(`Failed to get user: ${error.message}`)
      })

    return user
  }
