import type { AddressValue } from '../types/AddressValue'

/**
 * @name IDcaStrategyConfig
 * @description Serializable representation of the IDCAStrategyManager.StrategyConfig calldata struct.
 *              Numeric fields are raw uint256 values encoded as base-10 strings.
 */
export interface IDcaStrategyConfig {
  owner: AddressValue
  sourceVault: AddressValue
  targetVault: AddressValue
  inAsset: AddressValue
  outAsset: AddressValue
  inAssetFeed: AddressValue
  outAssetFeed: AddressValue
  tradeAmount: bigint
  interval: bigint
  slippageBps: bigint
  /** Price ceiling in oracle units. Maps to the UI concept of never buy above. */
  maxPrice: bigint
  /** Price floor in oracle units. Maps to the UI concept of never sell below. */
  minPrice: bigint
  endDate: bigint
  maxTrades: bigint
}
