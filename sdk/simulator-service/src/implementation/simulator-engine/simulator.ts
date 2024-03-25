import type { SimulationState } from '../../interfaces/simulation'
import type { Tail } from '../../interfaces/helperTypes'
import type { NextFunction } from '../../interfaces'
import { head, tail } from '../utils'
import { processStepOutput } from './stepProcessor/stepOutputProcessors'
import { stateReducer } from './reducer/stateReducers'
import type { SimulationStrategy } from '@summerfi/sdk-common/simulation'
import { steps } from '@summerfi/sdk-common/simulation'
import { Maybe } from '@summerfi/sdk-common/common'

export class Simulator<
  Strategy extends SimulationStrategy,
  NextArray extends NextFunction<SimulationStrategy, string>[] = [],
> {
  public schema: Strategy
  public originalSchema: SimulationStrategy
  private state: SimulationState
  private readonly nextArray: NextArray

  private constructor(
    schema: Strategy,
    originalSchema: SimulationStrategy,
    state: SimulationState = { swaps: [], balances: {}, positions: {}, steps: {} },
    nextArray: Readonly<NextArray> = [] as unknown as NextArray,
  ) {
    this.schema = schema
    this.originalSchema = originalSchema
    this.state = state
    this.nextArray = nextArray
  }

  static create<S extends SimulationStrategy>(schema: S) {
    // The second argument is the same as from the first schema we will subtract steps
    // with each next step added we also need to keep the original schema for future reference
    return new Simulator(schema, schema)
  }

  public async run(): Promise<SimulationState> {
    for (let i = 0; i < this.nextArray.length; i++) {
      const processedStepSchema = this.originalSchema[i]
      const getReference = (path: [string, string]) => {
        const [stepName, output] = path
        const step: Maybe<steps.Steps> = this.state.steps[stepName]

        if (!step) {
          throw new Error(
            `Step not found: ${stepName} in ${this.originalSchema[i].step} at iteration ${i}`,
          )
        }

        const outputs = step.outputs

        if (!outputs) {
          throw new Error(`Step has no outputs: ${stepName} in ${this.originalSchema[i].step}`)
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = (outputs as any)[output]
        // validation if path exists
        if (!value) {
          throw new Error(
            `Output not found: ${stepName}.outputs.${output} in ${this.originalSchema[i].step}`,
          )
        }

        return {
          estimatedValue: value,
          path,
        }
      }

      const nextStep = await this.nextArray[i]({ state: this.state, getReference })

      if (nextStep.skip === false || nextStep.skip === undefined) {
        const fullStep = await processStepOutput(nextStep)
        this.state = stateReducer(fullStep, this.state)
      }

      if (nextStep.skip === true && processedStepSchema.optional === false) {
        throw new Error(`Step is required: ${nextStep.type}`)
      }
    }

    return this.state
  }

  public next<N extends string>(
    next: NextFunction<Strategy, N>,
  ): Simulator<Tail<Strategy>, [...NextArray, NextFunction<Strategy, N>]> {
    const schemaHead = head(this.schema)
    const schemaTail = tail(this.schema)
    const nextArray = [...this.nextArray, next] as const

    if (!schemaHead) {
      throw new Error('No more steps to process')
    }

    return new Simulator<Tail<Strategy>, [...NextArray, NextFunction<Strategy, N>]>(
      schemaTail,
      this.originalSchema,
      this.state,
      nextArray,
    )
  }
}
