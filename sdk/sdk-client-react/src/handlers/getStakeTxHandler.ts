import type { ISDKManager } from '@summerfi/sdk-client'
import type { IUser } from '@summerfi/sdk-common'

export const getStakeTxHandler =
  (sdk: ISDKManager) =>
  async ({ user, amount }: { user: IUser; amount: bigint }) => {
    if (amount <= 0n) {
      throw new Error('Stake amount must be positive')
    }
    return sdk.armada.users.getStakeTx({ user, amount })
  }
