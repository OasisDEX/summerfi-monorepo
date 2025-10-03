import type { AddressValue } from '@summerfi/sdk-common'

/**
 * @name RebalanceDataSolidity
 * @description Data structure for rebalancing assets, used by Keepers of a fleet
 */
export interface RebalanceDataSolidity {
  /** Ark where the tokens are taken from */
  fromArk: AddressValue
  /** Ark where the tokens are moved to */
  toArk: AddressValue
  /** Amount of tokens to be moved */
  amount: bigint
}
