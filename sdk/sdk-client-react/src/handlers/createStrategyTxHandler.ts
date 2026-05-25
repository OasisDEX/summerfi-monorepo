import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const createStrategyTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    chainId,
    userAddress,
    fromVault,
    toVault,
    inAsset,
    outAsset,
    inAssetFeed,
    outAssetFeed,
    amount,
    slippagePercentage,
    intervalSeconds,
    maxTrades,
    neverBuyAbove,
    neverSellBelow,
    deadlineUnixTimestamp,
  }: {
    chainId: ChainId
    userAddress: AddressValue
    fromVault: AddressValue
    toVault: AddressValue
    inAsset: AddressValue
    outAsset: AddressValue
    inAssetFeed: AddressValue
    outAssetFeed: AddressValue
    amount: string
    slippagePercentage: string
    intervalSeconds: number
    maxTrades: number
    neverBuyAbove?: string
    neverSellBelow?: string
    deadlineUnixTimestamp?: number
  }) => {
    return sdk.armada.dca.createStrategyTx({
      chainId,
      userAddress,
      fromVault,
      toVault,
      inAsset,
      outAsset,
      inAssetFeed,
      outAssetFeed,
      amount,
      slippagePercentage,
      intervalSeconds,
      maxTrades,
      neverBuyAbove,
      neverSellBelow,
      deadlineUnixTimestamp,
    })
  }
