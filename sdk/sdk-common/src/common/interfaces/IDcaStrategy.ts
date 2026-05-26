import type { DcaStrategyStatusEnum } from '../enums/DcaStrategyStatus'
import type { AddressValue } from '../types/AddressValue'
import type { ChainId } from '../types/ChainId'

export interface IDcaStrategy {
  /** Unique identifier for the DCA strategy in graph */
  id: string
  /** On-chain strategy ID */
  strategyId: bigint
  /** The chain on which the strategy is executed */
  chainId: ChainId
  /** The EOA that owns the strategy */
  ownerAddress: AddressValue
  /** The vault from which assets will be sold in DCA trades */
  sourceVault: AddressValue
  /** The vault to which assets will be bought in DCA trades */
  targetVault: AddressValue
  /** The underlying asset of the source vault (input asset for DCA trades) */
  inAsset: AddressValue
  /** The underlying asset of the target vault (output asset for DCA trades) */
  outAsset: AddressValue
  /** Oracle price feed address for the input asset */
  inAssetFeed: AddressValue
  /** Oracle price feed address for the output asset */
  outAssetFeed: AddressValue
  /** Amount to trade in each execution, denominated in the source vault's underlying asset decimals */
  tradeAmount: bigint
  /** Maximum allowed slippage for each trade, expressed as a percentage */
  slippagePercentage: number
  /** Interval between consecutive trades, in seconds */
  intervalSeconds: bigint
  /** Unix timestamp of the next scheduled execution */
  nextTriggerAtUnixTimestamp: bigint
  /** Unix timestamp of the last scheduled execution */
  lastScheduledAtUnixTimestamp: bigint
  /** Unix timestamp after which the order stops executing */
  deadlineUnixTimestamp: bigint
  /** Current status of the strategy */
  status: DcaStrategyStatusEnum
  /** Maximum number of trades to execute before the order completes */
  maxTrades: bigint
  /** Number of trades that have been executed so far */
  tradesExecuted: bigint
  /** Price ceiling — skip execution if the fromVault token price is above this value. Zero means no ceiling. Full token units */
  neverBuyAbove: string
  /** Price floor — skip execution if the toVault token price is below this value. Zero means no floor. Full token units */
  neverSellBelow: string
  /** Unix timestamp when the strategy was created */
  createdAtUnixTimestamp: bigint
  /** Unix timestamp when the strategy was last updated */
  updatedAtUnixTimestamp: bigint
}
