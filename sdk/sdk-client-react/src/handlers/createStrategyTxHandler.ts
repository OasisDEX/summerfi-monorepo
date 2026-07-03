import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId, IChainlinkFeed } from '@summerfi/sdk-common'

/** @see IDcaManagerClient.createStrategyTx */
export const createStrategyTxHandler =
  (sdk: ISDKManager | ISDKInstiManager) =>
  async ({
    chainId,
    userAddress,
    fromVault,
    toVault,
    inAsset,
    outAsset,
    inAssetFeed,
    outAssetFeed,
    amountShares,
    assetAmount,
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
    inAssetFeed: IChainlinkFeed
    outAssetFeed: IChainlinkFeed
    amountShares: string
    assetAmount: string
    slippagePercentage: string
    intervalSeconds: number
    maxTrades: number
    neverBuyAbove?: string
    neverSellBelow?: string
    deadlineUnixTimestamp: number
  }) => {
    return sdk.dca.createStrategyTx({
      chainId,
      userAddress,
      fromVault,
      toVault,
      inAsset,
      outAsset,
      inAssetFeed,
      outAssetFeed,
      amountShares,
      assetAmount,
      slippagePercentage,
      intervalSeconds,
      maxTrades,
      neverBuyAbove,
      neverSellBelow,
      deadlineUnixTimestamp,
    })
  }
