import { SimulationType } from './SimulationType'
import { Token, TokenAmount } from '@summerfi/sdk/common'
import { Position } from '@summerfi/sdk/users'

export enum SimulationSteps {
  Flashloan = 'Flashloan',
  DepositBorrow = 'DepositBorrow',
  PaybackWithdraw = 'PaybackWithdraw',
  Swap = 'Swap',
  PullToken = 'PullToken',
  ReturnFunds = 'ReturnFunds',
  RepayFlashloan = 'RepayFlashloan',
}

export enum FlashloanProvider {
  Maker = 'Maker',
  Balancer = 'Balancer',
}

export interface Step<T extends SimulationSteps> {
  type: T
  inputs: object
  outputs: object
}

export interface FlashloanStep extends Step<SimulationSteps.Flashloan> {
  amount: TokenAmount
  provider: FlashloanProvider
}

export interface PullTokenStep extends Step<SimulationSteps.PullToken> {
  amount: TokenAmount
}

export interface DepositBorrowStep extends Step<SimulationSteps.DepositBorrow> {
  depositAmount: TokenAmount
  borrowAmount: TokenAmount
  position: Position
  // sum deposit amounts
}

export interface PaybackWithdrawStep extends Step<SimulationSteps.PaybackWithdraw> {
  paybackAmount: TokenAmount
  withdrawAmount: TokenAmount
  position: Position
}

export interface SwapStep extends Step<SimulationSteps.Swap> {
  fromTokenAmount: TokenAmount
  toTokenAmount: TokenAmount
  slippage: number
  fee: number
}

export interface ReturnFunds extends Step<SimulationSteps.ReturnFunds> {
  token: Token
}

export interface RepayFlashloan extends Step<SimulationSteps.RepayFlashloan> {}

export type Steps =
  | FlashloanStep
  | PullTokenStep
  | DepositBorrowStep
  | PaybackWithdrawStep
  | SwapStep
  | ReturnFunds
  | RepayFlashloan

/**
 * @interface Simulation
 * @description Simulation of a position. Specialized into the different types of simulations needed
 */
export interface Simulation<T extends SimulationType, Data> {
  simulationType: T
  /** @description Simulation data */
  simulationData: Data
  steps: Step<SimulationSteps>[]
}
