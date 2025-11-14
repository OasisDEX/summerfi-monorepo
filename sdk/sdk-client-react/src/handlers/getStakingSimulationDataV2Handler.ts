import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue } from '@summerfi/sdk-common'

export const getStakingSimulationDataV2Handler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async (params: { amount: bigint; period: bigint; sumrPriceUsd: number; userAddress: AddressValue }) => {
    return sdk.armada.users.getStakingSimulationDataV2(params)
  }
