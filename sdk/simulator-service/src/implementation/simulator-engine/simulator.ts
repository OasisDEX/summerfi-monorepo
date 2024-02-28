import { SimulationSteps, ValueReference, steps, SimulationStrategy } from '@summerfi/sdk-common/simulation'
import type { StepOutputProcessor, StepsWithouOutputs } from "~swap-service/interfaces/steps"
import type { SimulationState } from "~swap-service/interfaces/simulation"
import { EmptyArray, Tail, Where } from "~swap-service/interfaces/helperTypes"
import { addBalance, getReferencedValue, getTokenBalance, subtractBalance, switchCheck, tail } from "~swap-service/implementation/helpers"
import { stepOutputProcessors } from "./stepProcessors"


async function processStepOutput(step: StepsWithouOutputs): Promise<steps.Steps> {
  const processor = stepOutputProcessors[step.type] as StepOutputProcessor<steps.Steps>
  return processor(step)
}

function processState(step: steps.Steps, state: SimulationState): SimulationState {
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
        positions: {
          [step.inputs.position.positionId.id]: updatedPosition
        },
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

type NextFunction<Schema extends SimulationStrategy, Name extends string = string> = Schema extends EmptyArray 
  ? never 
  : (ctx: {state: SimulationState, getReference: (path: [string, string]) => ValueReference<any>}) => Promise<Omit<Where<steps.Steps, { type: Schema[0]['step'], name: Name }>, 'outputs'>>;

export class Simulator<Strategy extends SimulationStrategy, NextArray extends NextFunction<SimulationStrategy, string>[] = []> {
  private state: SimulationState
  private readonly nextArray: NextArray

  private constructor(public schema: Strategy, state: SimulationState = { balances: {}, positions: {}, steps: {} }, nextArray: Readonly<NextArray> = [] as unknown as NextArray) {
    this.state = state
    this.nextArray = nextArray
  }

  static create<S extends SimulationStrategy>(schema: S) {
    return new Simulator(schema)
  }

  public async run(): Promise<SimulationState> {
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

    return this.state as any
  }

  public next<N extends string>(next: NextFunction<Strategy, N>): Simulator<Tail<Strategy>, [...NextArray, NextFunction<Strategy, N>]> {
    const schemaTail = tail(this.schema)
    const nextArray = [...this.nextArray, next] as const

    return new Simulator<Tail<Strategy>, [...NextArray, NextFunction<Strategy, N>]>(schemaTail, this.state, nextArray)
  }
}
