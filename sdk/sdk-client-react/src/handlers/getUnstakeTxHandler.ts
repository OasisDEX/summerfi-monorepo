import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'

export const getUnstakeTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ amount }: { amount: bigint }) => {
    return sdk.armada.users.getUnstakeTx({ amount })
  }
