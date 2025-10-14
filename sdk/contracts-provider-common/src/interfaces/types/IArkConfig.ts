import { IAddress, type IPercentage } from '@summerfi/sdk-common'
import type { ITokenAmount } from 'node_modules/@summerfi/sdk-common/dist/common/interfaces/ITokenAmount'

/**
 * @name IArkConfig
 * @description Data structure for ark configuration
 */
export interface IArkConfig {
  commander: IAddress
  raft: IAddress
  asset: IAddress
  depositCap: ITokenAmount
  maxRebalanceOutflow: ITokenAmount
  maxRebalanceInflow: ITokenAmount
  name: string
  details: string
  requiresKeeperData: boolean
  maxDepositPercentageOfTVL: IPercentage
}
