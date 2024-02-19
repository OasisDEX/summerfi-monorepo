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

interface Step<T extends SimulationSteps, I, O = undefined> {
  type: T,
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
  name: string
  step: Steps['type']
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
    name: 'returnDebtFunds',
    step: SimulationSteps.ReturnFunds,
    optional: true,
  }
] as const

type Tail<T extends readonly any[]> = ((...t: T) => void) extends ((h: any, ...r: infer R) => void) ? R : never
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

function switchCheck(a: never): never {
  throw new Error('Run out of cases')
}

function processStep(step: Steps, state: SimulationState) {
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

type NextFunction<T extends SimulationSchema, Ctx> = (ctx: Ctx) => T extends EmptyArray ? never : Where<Steps, { type: T[0]['step'] }>

class Simulator<S extends SimulationSchema> {
  private state: SimulationState
  private steps: Steps[] = []

  private constructor(public schema: S, steps: Steps[] = [], state: SimulationState = { balances: {}, positions: {}, storage: {} }) {
    this.state = state
    this.steps = steps
  }

  static create<S extends SimulationSchema>(schema: S) {
    return new Simulator(schema)
  }

  public next(next: NextFunction<S, SimulationState>): Simulator<Tail<S>> {
    const [currentSchemaStep, ...rest] = this.schema
    const proccesedStep = next(this.state)

    if (currentSchemaStep.step !== proccesedStep.type) {
      throw new Error(`Invalid step, extected ${currentSchemaStep.step} but got ${proccesedStep.type}`)
    }

    if (!currentSchemaStep.optional && proccesedStep.skip) {
      throw new Error(`Step ${currentSchemaStep.name} is not optional`)
    }

    const nextState = processStep(proccesedStep, this.state)

    this.steps.push(proccesedStep)
    this.state = nextState

    return new Simulator<Tail<S>>(rest as Tail<S>, this.steps, this.state)
  }
}

const simulator = Simulator.create(refinanceSchema)

simulator
  .next((ctx) => ({
    name: 'fl',
    type: SimulationSteps.Flashloan,
    inputs: {
      amount: TokenAmount.createFrom({ amount: '0', token: { address: Address.createFrom({ hexValue: '0x00' }), decimals: 18 } }),
      provider: FlashloanProvider.Maker
    },
    outputs: undefined
  }))
  .next((ctx) => ({
    type: SimulationSteps.PaybackWithdraw,
    inputs: {
      paybackAmount: {
        estimatedValue: TokenAmount.createFrom({ amount: '0', token: { address: Address.createFrom({ hexValue: '0x00' }), decimals: 18 } }),
        path: ['fl', 'output']
      },
      withdrawAmount: TokenAmount.createFrom({ amount: '0', token: { address: Address.createFrom({ hexValue: '0x00' }), decimals: 18 } }),
      position: { positionId: { id: '' }, debtAmount: TokenAmount.createFrom({ amount: '0', token: { address: Address.createFrom({ hexValue: '0x00' }), decimals: 18 } }), collateralAmount: TokenAmount.createFrom({ amount: '0', token: { address: Address.createFrom({ hexValue: '0x00' }), decimals: 18 } }), pool: { poolId: { id: '' }, protocolId: { id: '' }, type: 'Lending', debtToken: { address: Address.createFrom({ hexValue: '0x00' }), decimals: 18 }, collateralToken: { address: Address.createFrom({ hexValue: '0x00' }), decimals: 18 } } }
    },
    outputs: {
      paybackAmount: TokenAmount.createFrom({ amount: '0', token: { address: Address.createFrom({ hexValue: '0x00' }), decimals: 18 } }),
      withdrawAmount: TokenAmount.createFrom({ amount: '0', token: { address: Address.createFrom({ hexValue: '0x00' }), decimals: 18 } })
    }
    }
))



