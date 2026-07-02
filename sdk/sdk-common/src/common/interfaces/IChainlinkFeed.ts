import type { AddressValue } from '../types/AddressValue'

/**
 * Serializable representation of the on-chain `ChainlinkFeed` struct
 * embedded in `IDCAStrategyManager.StrategyConfig`.
 * `maxStaleness` is in seconds; `0` means the contract default (24h).
 */
export interface IChainlinkFeed {
  feed: AddressValue
  maxStaleness: bigint
}
