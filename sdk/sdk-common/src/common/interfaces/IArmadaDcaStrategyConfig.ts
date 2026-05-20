import type { AddressValue } from '../types/AddressValue'

/**
 * @name IArmadaDcaStrategyConfig
 * @description Serializable representation of the IDCAStrategyManager.StrategyConfig calldata struct.
 *              Numeric fields are raw uint256 values encoded as base-10 strings.
 */
export interface IArmadaDcaStrategyConfig {
  strategyId: string
  owner: AddressValue
  sourceVault: AddressValue
  targetVault: AddressValue
  inAsset: AddressValue
  outAsset: AddressValue
  inAssetFeed: AddressValue
  outAssetFeed: AddressValue
  tradeAmount: string
  interval: string
  slippageBps: string
  /** Price ceiling in oracle units. Maps to the UI concept of never buy above. */
  maxPrice: string
  /** Price floor in oracle units. Maps to the UI concept of never sell below. */
  minPrice: string
  endDate: string
  maxTrades: string
}
