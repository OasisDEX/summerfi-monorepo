import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { type AddressValue, type ChainId } from '@summerfi/sdk-common'

export const createAndSaveBuyOrderHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    userAddress,
    chainId,
    fromVaultAddress,
    toVaultAddress,
    amount,
    slippagePercentage,
    intervalSeconds,
    nextExecutionAtUnixTimestamp,
    deadlineUnixTimestamp,
  }: {
    userAddress: AddressValue
    chainId: ChainId
    fromVaultAddress: AddressValue
    toVaultAddress: AddressValue
    /** Full token amount (e.g. "1.5" for 1.5 USDC, not raw units) */
    amount: string
    /** Slippage as a percentage (e.g. "0.5" for 0.5%) */
    slippagePercentage: string
    intervalSeconds: number
    /** Unix timestamp of the next scheduled execution */
    nextExecutionAtUnixTimestamp: number
    /** Unix timestamp after which the order expires */
    deadlineUnixTimestamp: number
  }) => {
    return sdk.armada.dca.createAndSaveBuyOrder({
      userAddress,
      chainId,
      fromVault: fromVaultAddress,
      toVault: toVaultAddress,
      amount,
      slippagePercentage,
      intervalSeconds,
      nextExecutionAtUnixTimestamp,
      deadlineUnixTimestamp,
    })
  }
