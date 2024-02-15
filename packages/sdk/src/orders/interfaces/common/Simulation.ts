import { TokenAmount } from '~sdk/common'
import { SimulationType } from './SimulationType'
import { Position } from '~sdk/users'

export enum SimulationSteps {
  Flashloan = 'Flashloan',
  DepositBorrow = 'DepositBorrow',
  PaybackWithdraw = 'PaybackWithdraw',
  Swap = 'Swap',
  PullToken = 'PullToken',
}

export enum FlashloanProvider {
  Maker = 'Maker',
  Balancer = 'Balancer',
}

interface Step<T extends SimulationSteps> {
  type: T
}

interface FlashloanStep extends Step<SimulationSteps.Flashloan> {
  amount: TokenAmount
  provider: FlashloanProvider
}

interface PullTokenStep extends Step<SimulationSteps.PullToken> {
  amount: TokenAmount
}

interface DepositBorrowStep extends Step<SimulationSteps.DepositBorrow> {
  depositAmount: TokenAmount | ValueReference<TokenAmount>
  borrowAmount: TokenAmount | ValueReference<TokenAmount>
  position: Position
  // sum deposit amounts
}

interface PaybackWithdrawStep extends Step<SimulationSteps.PaybackWithdraw> {
  paybackAmount: TokenAmount
  withdrawAmount: TokenAmount
  position: Position
}

interface SwapStep extends Step<SimulationSteps.Swap> {
  fromTokenAmount: TokenAmount
  toTokenAmount: TokenAmount
  slippage: number
  fee: number
}

export type Steps =
  | FlashloanStep
  | PullTokenStep
  | DepositBorrowStep
  | PaybackWithdrawStep
  | SwapStep

/**
 * @interface Simulation
 * @description Simulation of a position. Specialized into the different types of simulations needed
 */
export interface Simulation<T extends SimulationType> {
  simulationType: T
  sourcePosition: Position // TODO figure what do to when opening position (empty position or optional)
  targetPosition: Position
  steps: Steps[]
  // OPEN QUESTION: where errors and warnings and info messages?
}
