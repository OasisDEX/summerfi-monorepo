import { type AddressValue, ChainIds } from '@summerfi/sdk-common'

/** Default oracle staleness window in seconds. 0 = contract default (24h). */
export const DEFAULT_FEED_MAX_STALENESS = 0n

type AssetFeedMap = {
  [assetAddress: string]: AddressValue
}

type FeedMap = {
  [chainId: number]: AssetFeedMap | undefined
}

const ETH_SENTINEL = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

/**
 * Per-chain, per-asset Chainlink feed addresses (lowercased asset address -> feed address).
 * Base values verified from the summer-dca-base subgraph (real on-chain strategies).
 * Mainnet values are the canonical Chainlink mainnet feeds — VERIFY against the v5
 * contract's allowed-feed config (or a mainnet strategy once one exists) before relying on them.
 */
const DCA_FEEDS: FeedMap = {
  [ChainIds.Base]: {
    // USDC -> USDC/USD
    '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913':
      '0x7e860098f58bbfc8648a4311b374b1d669a2bc6b' as AddressValue,
    // WETH -> ETH/USD
    '0x4200000000000000000000000000000000000006':
      '0x71041dddad3595f9ced3dccfbe3d1f4b0a16bb70' as AddressValue,
    // ETH sentinel -> ETH/USD (same feed as WETH)
    [ETH_SENTINEL]: '0x71041dddad3595f9ced3dccfbe3d1f4b0a16bb70' as AddressValue,
  },
  [ChainIds.Mainnet]: {
    // USDC (0xA0b8…eB48) -> USDC/USD
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48':
      '0x8fffffd4afb6115b954bd326cbe7b4ba576818f6' as AddressValue,
    // WETH (0xC02a…6Cc2) -> ETH/USD
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2':
      '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419' as AddressValue,
    // ETH sentinel -> ETH/USD (same feed as WETH)
    [ETH_SENTINEL]: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419' as AddressValue,
  },
}

export const getDcaFeed = (
  chainId: number,
  assetAddress: AddressValue,
  maxStaleness: bigint = DEFAULT_FEED_MAX_STALENESS,
): { feed: AddressValue; maxStaleness: bigint } => {
  const chainFeeds = DCA_FEEDS[chainId]
  const feed = chainFeeds ? chainFeeds[assetAddress.toLowerCase()] : undefined

  if (!feed) {
    throw new Error(
      `No Chainlink feed configured for asset ${assetAddress} on chain ${chainId}. Configure it in dca-feeds.ts.`,
    )
  }

  return { feed, maxStaleness }
}
