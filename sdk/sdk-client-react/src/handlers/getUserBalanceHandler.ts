import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { User, type AddressValue } from '@summerfi/sdk-common'

/**
 * @name getUserBalanceHandler
 * @description Gets the SUMR balance of a user
 * @param params.userAddress The user's address
 * @param params.chainId The chain ID
 */
export const getUserBalanceHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ userAddress, chainId }: { userAddress: AddressValue; chainId: number }) => {
    const user = User.createFromEthereum(chainId, userAddress)
    return sdk.armada.users.getUserBalance({ user })
  }
