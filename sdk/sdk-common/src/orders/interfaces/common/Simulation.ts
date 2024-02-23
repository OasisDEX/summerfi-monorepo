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

export type SimulationSchema = readonly SchemaStep[]

function makeSchema<T extends SimulationSchema>(schema: T): T {
  return schema
}

const refinanceSchema = makeSchema([
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
])

type Tail<T extends readonly any[]> = ((...t: T) => void) extends ((h: any, ...r: infer R) => void) ? R : never
type Head<T extends readonly any[]> = T extends [infer H, ...any] ? H : never
type EmptyArray = readonly []
type Where<T, U> = T extends U ? T : never

interface SimulationState {
  // mapping between token address and token amount
  balances: Record<string, TokenAmount>
  positions: Record<string, Position>
  storage: Record<string, Steps['outputs']>
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

type NextFunction<T extends SimulationSchema, Ctx> = (ctx: Ctx) => Promise<T extends EmptyArray ? never : Where<Steps, { type: T[0]['step'] }>>

class Simulator<S extends SimulationSchema, T extends Array<Steps>> {
  private state: SimulationState
  private steps: T = []

  private constructor(public schema: S, steps: T = [], state: SimulationState = { balances: {}, positions: {}, storage: {} }) {
    this.state = state
    this.steps = steps
  }

  static create<S extends SimulationSchema>(schema: S) {
    return new Simulator(schema)
  }

  public async next(next: NextFunction<S, SimulationState>): Promise<Simulator<Tail<S>, [...T, Head<S>]>> {
    const [currentSchemaStep, ...rest] = this.schema
    const proccesedStep = await next(this.state)

    if (currentSchemaStep.step !== proccesedStep.type) {
      throw new Error(`Invalid step, extected ${currentSchemaStep.step} but got ${proccesedStep.type}`)
    }

    if (!currentSchemaStep.optional && proccesedStep.skip) {
      throw new Error(`Step ${proccesedStep.name} is not optional`)
    }

    const nextState = processStep(proccesedStep, this.state)

    this.steps.push(proccesedStep)
    this.state = nextState

    return new Simulator<Tail<S>, [...T, Head<S>]>(rest as Tail<S>, this.steps, this.state)
  }
}

const simulator = Simulator.create(refinanceSchema)

declare const debtToken: Token
declare const collateralToken: Token
declare const markerPosition: Position
declare const sparkPosition: Position

// function flashloanStepBulder<T extends string>(name: string, inputs: FlashloanStep['inputs']) {
//   return (ctx: SimulationState) => ({
//     name,
//     type: SimulationSteps.Flashloan,
//     inputs: {
//       amount: TokenAmount.createFrom({ amount: '0', token: debtToken }),
//       provider: FlashloanProvider.Maker
//     },
//     outputs: undefined
//   })
// }

// flashloanStepBulder('Flashloan', { amount: TokenAmount.createFrom({ amount: '0', token: debtToken }), provider: FlashloanProvider.Maker})

const x =(await simulator
  .next(async (ctx) => ({
    name: 'Flashloan',
    type: SimulationSteps.Flashloan,
    inputs: {
      amount: TokenAmount.createFrom({ amount: '0', token: debtToken }),
      provider: FlashloanProvider.Maker
    },
    outputs: undefined
  })))
  .next(async () => ({
    name: 'PaybackWithdraw',
    type: SimulationSteps.PaybackWithdraw,
    inputs: {
      paybackAmount: {
        estimatedValue: TokenAmount.createFrom({ amount: '0', token: debtToken }),
        path: ['Flashloan', '']
      },
      }
      withdrawAmount: TokenAmount.createFrom({ amount: '0', token: collateralToken }),
      position: markerPosition,
    },
    outputs: {
      paybackAmount: TokenAmount.createFrom({ amount: '85', token: debtToken }),
      withdrawAmount: TokenAmount.createFrom({ amount: '0', token: collateralToken })
    }
  }))
  .next((ctx) => ({
    name: 'SwapCollateralToken',
    type: SimulationSteps.Swap,
    inputs: {
      fromTokenAmount: TokenAmount.createFrom({ amount: '0', token: collateralToken }),
      toTokenAmount: TokenAmount.createFrom({ amount: '0', token: debtToken }),
      slippage: 0.5,
      fee: 0.1
    },
    outputs: {
      recievedAmount: TokenAmount.createFrom({ amount: '0', token: debtToken })
    }
  }))
  .next(() => ({
    name: 'DepositBorrow',
    type: SimulationSteps.DepositBorrow,
    inputs: {
      depositAmount: TokenAmount.createFrom({ amount: '0', token: collateralToken }),
      borrowAmount: TokenAmount.createFrom({ amount: '0', token: debtToken),
      position: sparkPosition
    },
    outputs: {
      depositAmount: TokenAmount.createFrom({ amount: '0', token: collateralToken }),
      borrowAmount: TokenAmount.createFrom({ amount: '0', token: debtToken })
    }
  }))
  .next(() => ({
    name: 'SwapDebtToken',
    type: SimulationSteps.Swap,
    inputs: {
      fromTokenAmount: TokenAmount.createFrom({ amount: '0', token: collateralToken }),
      toTokenAmount: TokenAmount.createFrom({ amount: '0', token: debtToken }),
      slippage: 0.5,
      fee: 0.1
    },
    outputs: {
      recievedAmount: TokenAmount.createFrom({ amount: '0', token: debtToken })
    }
  }))
  .next(() => ({
    name: "PaybackFlashloan",
    type: SimulationSteps.PaybackFlashloan,
    inputs: {
      amount: TokenAmount.createFrom({ amount: '0', token: debtToken })
    },
    outputs: undefined
  }
))