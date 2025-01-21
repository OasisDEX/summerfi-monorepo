import type { ISDKManager } from '@summerfi/sdk-client'

export const getStakeTx =
  (sdk: ISDKManager) =>
  async ({ amount }: { amount: bigint }) => {
    return sdk.armada.users.getStakeTx({ amount })
  }
