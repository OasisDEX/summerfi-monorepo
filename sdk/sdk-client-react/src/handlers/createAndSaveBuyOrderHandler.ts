import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { type AddressValue, type ChainId, type ITokenAmount } from '@summerfi/sdk-common'

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
    firstExecutionUnixTimestamp,
    deadlineUnixTimestamp,
    maxTrades,
    neverBuyAbove,
    neverSellBelow,
  }: {
    userAddress: AddressValue
    chainId: ChainId
    fromVaultAddress: AddressValue
    toVaultAddress: AddressValue
    /** Full token amount (e.g. "1.5" for 1.5 USDC, not raw units) */
    amount: ITokenAmount
    /** Slippage as a percentage (e.g. "0.5" for 0.5%) */
    slippagePercentage: string
    intervalSeconds: number
    /** Unix timestamp of the first scheduled execution */
    firstExecutionUnixTimestamp: number
    /** Unix timestamp after which the order stops executing (optional) */
    deadlineUnixTimestamp?: number
    /** Maximum number of trades to execute before the order completes */
    maxTrades: number
    /** Price ceiling — skip execution if the fromVault token price is above this value (optional) */
    neverBuyAbove?: string
    /** Price floor — skip execution if the toVault token price is below this value (optional) */
    neverSellBelow?: string
  }) => {
    return sdk.armada.dca.createAndSaveBuyOrder({
      userAddress,
      chainId,
      fromVault: fromVaultAddress,
      toVault: toVaultAddress,
      amount,
      slippagePercentage,
      intervalSeconds,
      firstExecutionUnixTimestamp,
      deadlineUnixTimestamp,
      maxTrades,
      neverBuyAbove,
      neverSellBelow,
    })
  }
