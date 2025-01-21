import type { ISDKManager } from '@summerfi/sdk-client'

export const getStakeTxHandler =
  (sdk: ISDKManager) =>
  async ({ amount }: { amount: bigint }) => {
    if (amount <= 0n) {
      throw new Error('Stake amount must be positive')
    }
    return sdk.armada.users.getStakeTx({ amount })
  }
