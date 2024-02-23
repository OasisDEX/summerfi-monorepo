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

type StepOutputProcessor<T extends Steps> = (step: Omit<T, 'outputs'>) => Promise<T>

interface FlashloanStep extends Step<
  SimulationSteps.Flashloan,
  {
    amount: TokenAmount
    provider: FlashloanProvider
  }
> { }

const flashloanOutputProcessor: StepOutputProcessor<FlashloanStep> = async (step) => {
  return {
    ...step,
    outputs: undefined
  }
}

interface PullTokenStep extends Step<
  SimulationSteps.PullToken,
  { amount: ReferencableField<TokenAmount> }
> { }

const pullTokenOutputProcessor: StepOutputProcessor<PullTokenStep> = async (step) => {
  return {
    ...step,
    outputs: undefined
  }
}

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

const depositBorrowOutputProcessor: StepOutputProcessor<DepositBorrowStep> = async (step) => {
  const depositAmount = step.inputs.additionalDeposit
    ? getReferencedValue(step.inputs.additionalDeposit).add(getReferencedValue(step.inputs.depositAmount)) 
    : getReferencedValue(step.inputs.depositAmount)

  return {
    ...step,
    outputs: {
      depositAmount: depositAmount,
      borrowAmount: getReferencedValue(step.inputs.borrowAmount)
    }
  }
}

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

const paybackWithdrawOutputProcessor: StepOutputProcessor<PaybackWithdrawStep> = async (step) => {
  const paybackAmount = getReferencedValue(step.inputs.paybackAmount).amount > step.inputs.position.debtAmount.amount 
    ? step.inputs.position.debtAmount 
    : getReferencedValue(step.inputs.paybackAmount)

  const withdrawAmount = getReferencedValue(step.inputs.withdrawAmount).amount > step.inputs.position.collateralAmount.amount
    ? step.inputs.position.collateralAmount
    : getReferencedValue(step.inputs.withdrawAmount)

  return {
    ...step,
    outputs: {
      paybackAmount: paybackAmount,
      withdrawAmount: withdrawAmount
    }
  }
}

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

const swapOutputProcessor: StepOutputProcessor<SwapStep> = async (step) => {
  return {
    ...step,
    outputs: {
      recievedAmount: step.inputs.toTokenAmount
    }
  }
}

interface ReturnFunds extends Step<
  SimulationSteps.ReturnFunds,
  { token: Token }
> { }

const returnFundsOutputProcessor: StepOutputProcessor<ReturnFunds> = async (step) => {
  return {
    ...step,
    outputs: undefined
  }
}

interface RepayFlashloan extends Step<
  SimulationSteps.PaybackFlashloan,
  { amount: TokenAmount }
> { }

const repayFlashloanOutputProcessor: StepOutputProcessor<RepayFlashloan> = async (step) => {
  return {
    ...step,
    outputs: undefined
  }
}

export type Steps =
  | FlashloanStep
  | PullTokenStep
  | DepositBorrowStep
  | PaybackWithdrawStep
  | SwapStep
  | ReturnFunds
  | RepayFlashloan

type StepOutputProcessors = {[Type in Steps['type']]: StepOutputProcessor<Where<Steps, {type: Type}>>}

const stepOutputProcessors: StepOutputProcessors = {
  [SimulationSteps.Flashloan]: flashloanOutputProcessor,
  [SimulationSteps.DepositBorrow]: depositBorrowOutputProcessor,
  [SimulationSteps.PaybackWithdraw]: paybackWithdrawOutputProcessor,
  [SimulationSteps.Swap]: swapOutputProcessor,
  [SimulationSteps.ReturnFunds]: returnFundsOutputProcessor,
  [SimulationSteps.PaybackFlashloan]: repayFlashloanOutputProcessor,
  [SimulationSteps.PullToken]: pullTokenOutputProcessor,
}

/**
 * @interface Simulation
 * @description Simulation of a position. Specialized into the different types of simulations needed
 */
export interface Simulation<T extends SimulationType> {
  simulationType: T
  sourcePosition?: Position // TODO figure what do to when opening position (empty position or optional)
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
  steps: Record<string /* step name */, Steps>
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

type StepsWithouOutputs = Omit<Steps, 'outputs'>
async function processStepOutput(step: StepsWithouOutputs): Promise<Steps> {
  const processor = stepOutputProcessors[step.type] as StepOutputProcessor<Steps>
  return processor(step)
}

function processState(step: Steps, state: SimulationState): SimulationState {
  switch (step.type) {
    case SimulationSteps.Flashloan: {
      return {
        ...state,
        steps: {
          [step.name]: step
        },
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
        // positions: {
        //   [step.inputs.position.positionId.id]: updatedPosition
        // },
        steps: {
          [step.name]: step
        },
        balances: afterBorrow
      }
    }
    case SimulationSteps.PaybackWithdraw: {
      const afterPayback = addBalance(getReferencedValue(step.inputs.paybackAmount), state.balances)
      const afterWithdraw = subtractBalance(getReferencedValue(step.inputs.withdrawAmount), afterPayback)
      return {
        ...state,
        steps: {
          [step.name]: step
        },
        balances: afterWithdraw
      }
    }
    case SimulationSteps.Swap: {
      const balanceWithoutFromToken = subtractBalance(step.inputs.fromTokenAmount, state.balances)
      const balanceWithToToken = addBalance(step.outputs.recievedAmount, balanceWithoutFromToken)
      return {
        ...state,
        steps: {
          [step.name]: step
        },
        balances: balanceWithToToken
      }
    }
    case SimulationSteps.ReturnFunds: {
      return {
        ...state,
        steps: {
          [step.name]: step
        },
        balances: subtractBalance(getTokenBalance(step.inputs.token, state.balances), state.balances)
      }
    }
    case SimulationSteps.PaybackFlashloan: {
      return {
        ...state,
        steps: {
          [step.name]: step
        },
        balances: subtractBalance(step.inputs.amount, state.balances)
      }
    }
    case SimulationSteps.PullToken: {
      return {
        ...state,
        steps: {
          [step.name]: step
        },
        balances: addBalance(getReferencedValue(step.inputs.amount), state.balances)
      }
    }
    default: {
      switchCheck(step)
    }
  }
}

type NextFunction<Schema extends SimulationSchema, Name extends string = string> = Schema extends EmptyArray 
  ? never 
  : (ctx: {state: SimulationState, getReference: (path: [string, string]) => ValueReference<any>}) => Promise<Omit<Where<Steps, { type: Schema[0]['step'], name: Name }>, 'outputs'>>;

function tail<T extends readonly any[]>(arr: T): Tail<T> {
  const [_, ...rest] = arr

  return rest as any as Tail<T>
}

class Simulator<Shema extends SimulationSchema, NextArray extends NextFunction<SimulationSchema, string>[] = []> {
  private state: SimulationState
  private readonly nextArray: NextArray

  private constructor(public schema: Shema, state: SimulationState = { balances: {}, positions: {}, steps: {} }, nextArray: Readonly<NextArray> = [] as unknown as NextArray) {
    this.state = state
    this.nextArray = nextArray
  }

  static create<S extends SimulationSchema>(schema: S) {
    return new Simulator(schema)
  }

  public async run(simulationType: Shema extends EmptyArray ? SimulationType : never): Promise<Shema extends EmptyArray ? Simulation<SimulationType> : never> {
    const getReference = (path: [string, string]) => {
      const [step, name] = path
      return {
        estimatedValue: (this.state.steps[step] as any).outputs[name as any], // TODO: fix this types
        path
      }
    }

    for (const next of this.nextArray) {
      const nextStep = await next({state: this.state, getReference })
      const fullStep = await processStepOutput(nextStep)
      this.state = processState(fullStep, this.state)
    }

    return {
      simulationType: simulationType,
      sourcePosition: this.state.positions['sourcePosition'],
      targetPosition: this.state.positions['targetPosition'],
      steps: this.state.steps
    } as any
  }

  public next<N extends string>(next: NextFunction<Shema, N>): Simulator<Tail<Shema>, [...NextArray, NextFunction<Shema, N>]> {
    const _tail = tail(this.schema)
    const nextArray = [...this.nextArray, next] as const

    return new Simulator<Tail<Shema>, [...NextArray, NextFunction<Shema, N>]>(_tail, this.state, nextArray)
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
      withdrawAmount: ctx.getReference(['Flashloan', 'recievedAmount']),
      position: markerPosition
    },
  })).next(async (ctx) => ({
    name: 'Swap',
    type: SimulationSteps.Swap,
    inputs: {
      fromTokenAmount: TokenAmount.createFrom({ amount: '0', token: collateralToken }),
      toTokenAmount: TokenAmount.createFrom({ amount: '0', token: collateralToken }),
      slippage: 0.05,
      fee: 0.03
    },
  }))

  