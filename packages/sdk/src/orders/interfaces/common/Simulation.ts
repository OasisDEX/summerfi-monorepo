import { Token, TokenAmount } from '~sdk/common'
import { SimulationType } from './SimulationType'
import { Position } from '~sdk/users'

export enum SimulationSteps {
  Flashloan = 'Flashloan',
  DepositBorrow = 'DepositBorrow',
  PaybackWithdraw = 'PaybackWithdraw',
  Swap = 'Swap',
  PullToken = 'PullToken',
  ReturnFunds = 'ReturnFunds',
  PaybackFlashloan = 'PaybackFlashloan',
}

interface ValueReference<T> {
  estimatedValue: T
  path: [string, string]
}

export enum FlashloanProvider {
  Maker = 'Maker',
  Balancer = 'Balancer',
}

interface Step<T extends SimulationSteps, I, O> {
  type: T,
  inputs: I,
  outputs: O,
}

interface FlashloanStep extends Step<
  SimulationSteps.Flashloan,
  {
    amount: TokenAmount
    provider: FlashloanProvider
  },
  never
> { }

interface PullTokenStep extends Step<
  SimulationSteps.PullToken,
  { amount: TokenAmount | ValueReference<TokenAmount> },
  never
> { }

interface DepositBorrowStep extends Step<SimulationSteps.DepositBorrow,
  {
    depositAmount: TokenAmount | ValueReference<TokenAmount>
    borrowAmount: TokenAmount| ValueReference<TokenAmount>
    position: Position
    additionalDeposit?: ValueReference<TokenAmount>
  },
  {
    depositAmount: TokenAmount,
    borrowAmount: TokenAmount,
  }
> { }

interface PaybackWithdrawStep extends Step<
  SimulationSteps.PaybackWithdraw,
  {
    paybackAmount: TokenAmount
    withdrawAmount: TokenAmount
    position: Position,
  },
  {
    paybackAmount: TokenAmount
    withdrawAmount: TokenAmount
  }
> { }

interface SwapStep extends Step<
  SimulationSteps.Swap,
  {
    fromTokenAmount: TokenAmount
    toTokenAmount: TokenAmount
    slippage: number
    fee: number
  },
  {
    recievedAmount: TokenAmount
  }
> { }

interface ReturnFunds extends Step<
  SimulationSteps.ReturnFunds,
  { token: Token },
  never
> { }

interface RepayFlashloan extends Step<
  SimulationSteps.PaybackFlashloan,
  never,
  never
> { }

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
export interface Simulation<T extends SimulationType> {
  simulationType: T
  sourcePosition: Position // TODO figure what do to when opening position (empty position or optional)
  targetPosition: Position
  steps: Steps[]
  // OPEN QUESTION: where errors and warnings and info messages?
}

interface SchemaStep {
  name: string
  step: SimulationSteps
  optional: boolean
}

type SimulationSchema = readonly SchemaStep[]

const refinanceSchema = [
  {
    name: 'flashloan',
    step: SimulationSteps.Flashloan,
    optional: false,
  },
  {
    name: 'paybackWithdrawSourceProtocol',
    step: SimulationSteps.PaybackWithdraw,
    optional: false,
  },
  {
    name: 'collateralSwap',
    step: SimulationSteps.Swap,
    optional: true,
  },
  {
    name: 'depositBorrowTargetProtocol',
    step: SimulationSteps.DepositBorrow,
    optional: false,
  },
  {
    name: 'debtSwap',
    step: SimulationSteps.Swap,
    optional: true,
  },
  {
    name: 'paybackFlashloan',
    step: SimulationSteps.PaybackFlashloan,
    optional: false,
  },
  {
    // In case of target debt being different then source debt we need a swap, 
    // We cannot forsee the exact amount of the swap, so we need to return excess tokens to user
    name: 'returnDebtFunds' as const,
    step: SimulationSteps.ReturnFunds,
    optional: true,
  }
] as const

type StepNames<T extends SimulationSchema> = T[number]['name']

type StorageMap<T extends SimulationSchema> = {[K in T[number]['name']]: T[number]['step'] }

type names = StorageMap<typeof refinanceSchema>

type Tail<T extends readonly any[]> = ((...t: T) => void) extends ((h: any, ...r: infer R) => void) ? R : never
type EmptyArray = readonly []

interface SimulationState {
  // mapping between token address and token amount
  balances: Record<string, TokenAmount>
  positions: Record<string, Position>
  storage: Record<string, Steps['outputs']>
}

class Simulator<S extends SimulationSchema> {
  private state: SimulationState

  private constructor(public schema: S, state: SimulationState = { balances: {}, positions: {}, storage: {} }) {
    this.state = state
  }

  static create<S extends SimulationSchema>(schema: S) {
    return new Simulator(schema)
  }

  public next(next: S extends EmptyArray ? never : S[0]['step']): Simulator<Tail<S>> {
    const [, ...rest] = this.schema
    return new Simulator(rest, this.state) as Simulator<Tail<S>>
  }
}

const simulator =  Simulator.create(refinanceSchema)

simulator
  .next(SimulationSteps.Flashloan)
  .next(SimulationSteps.PaybackWithdraw)
  .next(SimulationSteps.Swap)
  .next(SimulationSteps.DepositBorrow)
  .next(SimulationSteps.Swap)
  .next(SimulationSteps.PaybackFlashloan)
  .next(SimulationSteps.ReturnFunds)