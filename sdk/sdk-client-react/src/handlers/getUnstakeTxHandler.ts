import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'

export const getUnstakeTxHandler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  async ({ amount }: { amount: bigint }) => {
    return sdk.armada.users.getUnstakeTx({ amount })
  }
