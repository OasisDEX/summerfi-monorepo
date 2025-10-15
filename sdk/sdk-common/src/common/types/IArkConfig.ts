import type { IAddress } from '../interfaces/IAddress'
import type { IPercentage } from '../interfaces/IPercentage'

/**
 * @name IArkConfig
 * @description Data structure for ark configuration
 */
export interface IArkConfig {
  commander: IAddress
  raft: IAddress
  asset: IAddress
  depositCap: string
  maxRebalanceOutflow: string
  maxRebalanceInflow: string
  name: string
  details: string
  requiresKeeperData: boolean
  maxDepositPercentageOfTVL: IPercentage
}
