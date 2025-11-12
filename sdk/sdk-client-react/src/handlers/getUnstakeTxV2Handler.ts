import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'

export const getUnstakeTxV2Handler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ userStakeIndex, amount }: { userStakeIndex: bigint; amount: bigint }) => {
    if (amount <= 0n) {
      throw new Error('Unstake amount must be positive')
    }
    return sdk.armada.users.getUnstakeTxV2({ userStakeIndex, amount })
  }
