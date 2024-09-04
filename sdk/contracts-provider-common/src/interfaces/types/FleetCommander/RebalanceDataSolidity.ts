/**
 * @name RebalanceDataSolidity
 * @description Data structure for rebalancing assets, used by Keepers of a fleet
 */
export interface RebalanceDataSolidity {
  /** Ark where the tokens are taken from */
  fromArk: bigint
  /** Ark where the tokens are moved to */
  toArk: bigint
  /** Amount of tokens to be moved */
  amount: bigint
}
