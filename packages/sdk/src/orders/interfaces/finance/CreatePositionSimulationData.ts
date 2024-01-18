import { RiskRatio } from '~sdk/common'
import { SimulationData } from '~sdk/orders'

/**
 * @interface CreatePositionSimulationData
 * @description Simulation data for a position. The position can be either a new position or an existing one.*
 */
export interface CreatePositionSimulationData extends SimulationData {
  // TODO: review and adjust accordingly
  riskRatio: RiskRatio
  healthFactor: string
  relativeCollateralPriceMovementUntilLiquidation: string
  liquidationPrice: string
  maxDebtToBorrow: string
  maxDebtToBorrowWithCurrentCollateral: string
  maxCollateralToWithdraw: string
  debtToPaybackAll: string
  oraclePriceForCollateralDebtExchangeRate: string
}
