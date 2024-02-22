import { Address, Token, TokenAmount } from '~sdk/common'
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
  Awesomeness = 'Awesomeness',
}

interface ValueReference<T> {
  estimatedValue: T
  path: [string, string]
}

type ReferencableField<T> = T | ValueReference<T>

export enum FlashloanProvider {
  Maker = 'Maker',
  Balancer = 'Balancer',
}

interface Step<T extends SimulationSteps, I, O = undefined, N extends string = string> {
  type: T,
  name: N, 
  inputs: I,
  outputs: O,
  skip?: boolean
}

interface FlashloanStep extends Step<
  SimulationSteps.Flashloan,
  {
    amount: TokenAmount
    provider: FlashloanProvider
  }
> { }

interface PullTokenStep extends Step<
  SimulationSteps.PullToken,
  { amount: ReferencableField<TokenAmount> }
> { }

interface DepositBorrowStep extends Step<SimulationSteps.DepositBorrow,
  {
    depositAmount: ReferencableField<TokenAmount>
    borrowAmount: ReferencableField<TokenAmount>
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
    paybackAmount: ReferencableField<TokenAmount>
    withdrawAmount: ReferencableField<TokenAmount>
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
  { token: Token }
> { }

interface RepayFlashloan extends Step<
  SimulationSteps.PaybackFlashloan,
  { amount: TokenAmount }
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

export interface SchemaStep {
  step: SimulationSteps
  optional: boolean
}

type SimulationSchema = readonly SchemaStep[]

const refinanceSchema = [
  {
    step: SimulationSteps.Flashloan,
    optional: false,
  },
  {
    step: SimulationSteps.PaybackWithdraw,
    optional: false,
  },
  {
    step: SimulationSteps.Swap,
    optional: true,
  },
  {
    step: SimulationSteps.DepositBorrow,
    optional: false,
  },
  {
    step: SimulationSteps.Swap,
    optional: true,
  },
  {
    step: SimulationSteps.PaybackFlashloan,
    optional: false,
  },
  {
    // In case of target debt being different then source debt we need a swap, 
    // We cannot forsee the exact amount of the swap, so we need to return excess tokens to user
    step: SimulationSteps.ReturnFunds,
    optional: true,
  }
] as const

type Tail<T extends readonly any[]> = ((...t: T) => void) extends ((h: any, ...r: infer R) => void) ? R : never
// type Tail<T extends readonly any[]> = T extends [any, ...infer R] ? R : never
type Head<T extends readonly any[]> = T extends [infer H, ...any] ? H : never
type EmptyArray = readonly []
type Where<T, U> = T extends U ? T : never
type Unpack<T> = T extends Promise<infer U> 
  ? U 
  : T extends Array<infer Y>
    ? Y
    : never

interface SimulationState {
  // mapping between token address and token amount
  balances: Record<string, TokenAmount>
  positions: Record<string, Position>
  steps: Steps[]
}

function isReference<T>(value: ReferencableField<T>): value is ValueReference<T> {
  return (value as ValueReference<T>).path !== undefined && (value as ValueReference<T>).estimatedValue !== undefined
}

function getReferencedValue<T>(referencableValue: ReferencableField<T>): T {
  if (isReference(referencableValue)) {
    return referencableValue.estimatedValue
  }
  return referencableValue
}

function getTokenBalance(token: Token, balances: Record<string, TokenAmount>): TokenAmount {
  return balances[token.address.hexValue] || TokenAmount.createFrom({ amount: '0', token })
}

function addBalance(amount: TokenAmount, balance: Record<string, TokenAmount>): Record<string, TokenAmount> {
  return {
    ...balance,
    [amount.token.address.hexValue]: balance[amount.token.address.hexValue] ? balance[amount.token.address.hexValue].add(amount) : amount
  }
}

function subtractBalance(amount: TokenAmount, balance: Record<string, TokenAmount>): Record<string, TokenAmount> {
  return {
    ...balance,
    [amount.token.address.hexValue]: balance[amount.token.address.hexValue].substrac(amount)
  }
}

function switchCheck(_a: never): never {
  throw new Error('Run out of cases')
}

function processStep(step: Steps, state: SimulationState): SimulationState {
  switch (step.type) {
    case SimulationSteps.Flashloan: {
      return {
        ...state,
        balances: addBalance(step.inputs.amount, state.balances)
      }
    }
    case SimulationSteps.DepositBorrow: {
      const afterDeposit = subtractBalance(getReferencedValue(step.inputs.depositAmount), state.balances)
      const afterBorrow = addBalance(getReferencedValue(step.inputs.borrowAmount), afterDeposit)
      // step.inputs.position// `dpmId-protocol(aavev3 | aavev2)`
      // step.inputs.position// `dpmId-protocol(morpho)-morketId`
      // step.inputs.position// `dpmId-protocol(ajna)-`
      // const updatedPosition = deposit(state.positions[step.inputs.position.positionId] || step.inputs.position, amount): Position
      return {
        ...state,
        positions: {
          [step.inputs.position.positionId.id]: updatedPosition
        },
        balances: afterBorrow
      }
    }
    case SimulationSteps.PaybackWithdraw: {
      const afterPayback = addBalance(getReferencedValue(step.inputs.paybackAmount), state.balances)
      const afterWithdraw = subtractBalance(getReferencedValue(step.inputs.withdrawAmount), afterPayback)
      return {
        ...state,
        balances: afterWithdraw
      }
    }
    case SimulationSteps.Swap: {
      const balanceWithoutFromToken = subtractBalance(step.inputs.fromTokenAmount, state.balances)
      const balanceWithToToken = addBalance(step.outputs.recievedAmount, balanceWithoutFromToken)
      return {
        ...state,
        balances: balanceWithToToken
      }
    }
    case SimulationSteps.ReturnFunds: {
      return {
        ...state,
        balances: subtractBalance(getTokenBalance(step.inputs.token, state.balances), state.balances)
      }
    }
    case SimulationSteps.PaybackFlashloan: {
      return {
        ...state,
        balances: subtractBalance(step.inputs.amount, state.balances)
      }
    }
    case SimulationSteps.PullToken: {
      return {
        ...state,
        balances: addBalance(getReferencedValue(step.inputs.amount), state.balances)
      }
    }
    default: {
      switchCheck(step)
    }
  }
}

type NextFunction<T extends SimulationSchema, N extends string> = T extends EmptyArray ? never : (ctx: SimulationState) => Promise<Omit<Where<Steps, { type: T[0]['step'], name: N }>, 'outputs'>>;
type RegisteredStepsTypesFromNextArray<NextArray extends NextFunction<SimulationSchema, string>[]> = Unpack<ReturnType<Unpack<NextArray>>>['type']
type RegisteredStepsNamesFromNextArray<NextArray extends NextFunction<SimulationSchema, string>[]> = Unpack<ReturnType<Unpack<NextArray>>>['name']
type RegisteredStepsFromNextArray<S extends NextFunction<SimulationSchema>[]> = {[key in RegisteredStepsNamesFromNextArray<S>]: key }

function tail<T extends readonly any[]>(arr: T): Tail<T> {
  const [_, ...rest] = arr

  return rest as any as Tail<T>
}

class Simulator<Shema extends SimulationSchema, NextArray extends NextFunction<SimulationSchema>[] = []> {
  private state: SimulationState
  private nextArray = [] as unknown as NextArray

  private constructor(public schema: Shema, state: SimulationState = { balances: {}, positions: {}, steps: [] }) {
    this.state = state
  }

  static create<S extends SimulationSchema>(schema: S) {
    return new Simulator(schema)
  }

  public test(t: NextArray) {
    return t
  }

  public next<N extends string>(next: NextFunction<Shema, N>): Simulator<Tail<Shema>, [...NextArray, NextFunction<Shema, N>]> {
    const [currentSchemaStep, ...rest] = this.schema
    const _tail = tail(this.schema)
    this.nextArray.push(next)

    // const proccesedStep = await next(this.state)

    // if (currentSchemaStep.step !== proccesedStep.type) {
    //   throw new Error(`Invalid step, extected ${currentSchemaStep.step} but got ${proccesedStep.type}`)
    // }

    // if (!currentSchemaStep.optional && proccesedStep.skip) {
    //   throw new Error(`Step ${proccesedStep.name} is not optional`)
    // }

    // const nextState = processStep(proccesedStep, this.state)

    // this.steps.push(proccesedStep)
    // this.state = nextState

    return new Simulator<Tail<Shema>, [...NextArray, NextFunction<Shema, N>]>(_tail, this.state)
  }
}

const simulator = Simulator.create(refinanceSchema)

declare const debtToken: Token
declare const collateralToken: Token
declare const markerPosition: Position
declare const sparkPosition: Position


const x = simulator
  .next(async (ctx) => ({
    name: 'Flashloan',
    type: SimulationSteps.Flashloan,
    inputs: {
      amount: TokenAmount.createFrom({ amount: '0', token: debtToken }),
      provider: FlashloanProvider.Maker
    },
  }))
  .next(async (ctx) => ({
    name: 'PaybackWithdraw',
    type: SimulationSteps.PaybackWithdraw,
    inputs: {
      paybackAmount: TokenAmount.createFrom({ amount: '0', token: debtToken }),
      withdrawAmount: TokenAmount.createFrom({ amount: '0', token: collateralToken }),
      position: markerPosition
    },
  }))
  .test('Flashloan')
  