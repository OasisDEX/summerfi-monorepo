import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { IUser } from '@summerfi/sdk-common'

export const getStakeTxV2Handler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ user, amount, lockupPeriod }: { user: IUser; amount: bigint; lockupPeriod: bigint }) => {
    if (amount <= 0n) {
      throw new Error('Stake amount must be positive')
    }
    if (lockupPeriod < 0n) {
      throw new Error('Lockup period must be non-negative')
    }
    return sdk.armada.users.getStakeTxV2({ user, amount, lockupPeriod })
  }
