import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { IUser } from '@summerfi/sdk-common'

export const getUnstakeTxV2Handler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    user,
    userStakeIndex,
    amount,
  }: {
    user: IUser
    userStakeIndex: bigint
    amount: bigint
  }) => {
    if (amount <= 0n) {
      throw new Error('Unstake amount must be positive')
    }
    return sdk.armada.users.getUnstakeTxV2({ user, userStakeIndex, amount })
  }
