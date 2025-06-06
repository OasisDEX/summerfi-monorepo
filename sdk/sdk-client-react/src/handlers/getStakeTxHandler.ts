import type { ISDKManager } from '@summer_fi/sdk-client'
import type { IUser } from '@summer_fi/sdk-client'

export const getStakeTxHandler =
  (sdk: ISDKManager) =>
  async ({ user, amount }: { user: IUser; amount: bigint }) => {
    if (amount <= 0n) {
      throw new Error('Stake amount must be positive')
    }
    return sdk.armada.users.getStakeTx({ user, amount })
  }
