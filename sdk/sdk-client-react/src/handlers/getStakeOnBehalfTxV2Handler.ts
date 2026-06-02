import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import type { IAddress, IUser } from '@summerfi/sdk-common'

export const getStakeOnBehalfTxV2Handler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  async ({
    user,
    receiver,
    amount,
    lockupPeriod,
  }: {
    user: IUser
    receiver: IAddress
    amount: bigint
    lockupPeriod: bigint
  }) => {
    if (amount <= 0n) {
      throw new Error('Stake amount must be positive')
    }
    if (lockupPeriod < 0n) {
      throw new Error('Lockup period must be non-negative')
    }
    return sdk.armada.users.getStakeOnBehalfTxV2({ user, receiver, amount, lockupPeriod })
  }
