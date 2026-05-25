import type { ArmadaDcaOrderStatusEnum } from '../enums/ArmadaDcaOrderStatus'
import type { AddressValue } from '../types/AddressValue'
import type { ChainId } from '../types/ChainId'
import type { HexData } from '../types/HexData'

export interface IArmadaDcaOrder {
  id: string
  /** External order identifier provided by the caller (distinct from the DB row id) */
  orderId: string
  userAddress: AddressValue
  chainId: ChainId
  fromVault: AddressValue
  toVault: AddressValue
  amount: string
  slippage: string
  intervalSeconds: number
  /** Unix timestamp of the next scheduled execution */
  nextExecutionAtUnixTimestamp: number
  /** Unix timestamp after which the order stops executing (optional — absent means run until maxTrades is reached) */
  deadlineUnixTimestamp?: number
  /** Maximum number of trades to execute before the order completes */
  maxTrades: number
  /** Number of trades that have been executed so far */
  tradesExecuted: number
  allowedVaultsRoot: HexData
  fromVaultProof: HexData[]
  toVaultProof: HexData[]
  swapCalldata: HexData
  signature: HexData
  ensoRouterAddress: AddressValue
  verifyingContractAddress: AddressValue
  status: ArmadaDcaOrderStatusEnum
  createdAt: number
  updatedAt: number
  cancelledAt?: number
  pausedAt?: number
  /** Price ceiling — skip execution if the fromVault token price is above this value */
  neverBuyAbove?: string
  /** Price floor — skip execution if the toVault token price is below this value */
  neverSellBelow?: string
  /** The underlying asset of the source vault (input asset for DCA trades) */
  inAsset: AddressValue
  /** The underlying asset of the target vault (output asset for DCA trades) */
  outAsset: AddressValue
  /** Oracle price feed address for the input asset */
  inAssetFeed: AddressValue
  /** Oracle price feed address for the output asset */
  outAssetFeed: AddressValue
}
