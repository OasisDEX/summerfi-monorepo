import type { ISDKManager } from '@summer_fi/sdk-client'

export const getUnstakeTxHandler =
  (sdk: ISDKManager) =>
  async ({ amount }: { amount: bigint }) => {
    return sdk.armada.users.getUnstakeTx({ amount })
  }
