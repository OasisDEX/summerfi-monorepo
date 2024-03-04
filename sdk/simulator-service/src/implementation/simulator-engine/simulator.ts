import type { SimulationStrategy } from '@summerfi/sdk-common/simulation'
import type { SimulationState } from '~swap-service/interfaces/simulation'
import type { Tail } from '~swap-service/interfaces/helperTypes'
import type { NextFunction } from '../../interfaces'
import { tail } from '~swap-service/implementation/helpers'
import { processStepOutput } from './stepProcessor'
import { stateReducer } from './reducer'

export class Simulator<
  Strategy extends SimulationStrategy,
  NextArray extends NextFunction<SimulationStrategy, string>[] = [],
> {
  private state: SimulationState
  private readonly nextArray: NextArray

  private constructor(
    public schema: Strategy,
    state: SimulationState = { balances: {}, positions: {}, steps: {} },
    nextArray: Readonly<NextArray> = [] as unknown as NextArray,
  ) {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        estimatedValue: (this.state.steps[step] as any).outputs[name as any], // TODO: fix this types
        path,
      }
    }

    for (const next of this.nextArray) {
      const nextStep = await next({ state: this.state, getReference })
      const fullStep = await processStepOutput(nextStep)
      this.state = stateReducer(fullStep, this.state)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.state as any
  }

  public next<N extends string>(
    next: NextFunction<Strategy, N>,
  ): Simulator<Tail<Strategy>, [...NextArray, NextFunction<Strategy, N>]> {
    const schemaTail = tail(this.schema)
    const nextArray = [...this.nextArray, next] as const

    return new Simulator<Tail<Strategy>, [...NextArray, NextFunction<Strategy, N>]>(
      schemaTail,
      this.state,
      nextArray,
    )
  }
}
