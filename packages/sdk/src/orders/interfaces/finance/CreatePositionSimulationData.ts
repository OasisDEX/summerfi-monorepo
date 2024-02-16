import { RiskRatio } from '~sdk/common'
import { Simulation } from '~sdk/orders'
import { SimulationType } from '../common/SimulationType'

interface CreatePositionSimulationData {
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

/**
 * @interface CreatePositionSimulation
 * @description Simulation data for a position. The position can be either a new position or an existing one.*
 */
export type CreatePositionSimulation = Simulation<
  SimulationType.CreatePosition,
  CreatePositionSimulationData
>
