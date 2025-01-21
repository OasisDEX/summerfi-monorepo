import type { ISDKManager } from '@summerfi/sdk-client'

export const getUnstakeTx =
  (sdk: ISDKManager) =>
  async ({ amount }: { amount: bigint }) => {
    return sdk.armada.users.getUnstakeTx({ amount })
  }
