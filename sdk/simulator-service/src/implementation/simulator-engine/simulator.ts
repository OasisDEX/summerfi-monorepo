import type { ISimulationState } from '../../interfaces/simulation'
import type { Tail } from '../../interfaces/helperTypes'
import { head, tail } from '../utils'
import { processStepOutput } from './stepProcessor/stepOutputProcessors'
import { stateReducer } from './reducer/stateReducers'
import type { SimulationStrategy } from '@summerfi/sdk-common/simulation'
import { steps } from '@summerfi/sdk-common/simulation'
import { Maybe } from '@summerfi/sdk-common'
import { GetReferencedValue, NextFunction, Paths, ProccessedStep, StepsAdded } from '../../interfaces/steps'

export class Simulator<
  Strategy extends SimulationStrategy,
  AddedSteps extends StepsAdded
> {
  public schema: Strategy
  public originalSchema: SimulationStrategy
  private state: ISimulationState
  private readonly nextArray: Readonly<NextFunction<SimulationStrategy, AddedSteps>[]>

  private constructor(
    schema: Strategy,
    originalSchema: SimulationStrategy,
    state: ISimulationState = { swaps: {}, balances: {}, positions: {}, steps: {} },
    nextArray: Readonly<NextFunction<Strategy, AddedSteps>[]> = [],
  ) {
    this.schema = schema
    this.originalSchema = originalSchema
    this.state = state
    this.nextArray = nextArray
  }

  static create<S extends SimulationStrategy>(schema: S) {
    // The second argument is the same as from the first schema we will subtract steps
    // with each next step added we also need to keep the original schema for future reference
    return new Simulator<S, []>(schema, schema)
  }

  private getReference = (path: Paths<AddedSteps>) => {
    const [stepName, output] = path
    const step: Maybe<steps.Steps> = this.state.steps[stepName]

    if (!step) {
      throw new Error(
        `Step not found: ${stepName}`,
      )
    }

    const outputs = step.outputs

    if (!outputs) {
      throw new Error(`Step has no outputs: ${stepName}`)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (outputs as any)[output]
    // validation if path exists
    if (!value) {
      throw new Error(
        `Output not found: ${stepName}.outputs.${output as string}`,
      )
    }

    return {
      estimatedValue: value,
      path,
    }
  }

  public async run(): Promise<ISimulationState & { getReference: GetReferencedValue<AddedSteps> }> {
    for (let i = 0; i < this.nextArray.length; i++) {
      const getReference = (path: Paths<AddedSteps>) => {
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
            `Output not found: ${stepName}.outputs.${output as string} in ${this.originalSchema[i].step}`,
          )
        }

        return {
          estimatedValue: value,
          path,
        }
      }

      const nextStep = await this.nextArray[i]({ state: this.state, getReference: getReference as GetReferencedValue<AddedSteps> })

      const fullStep = await processStepOutput(nextStep)
      this.state = stateReducer(fullStep, this.state)
    }

    return this.state
  }

  public next(
    next: NextFunction<Strategy, AddedSteps>,
    skip?: boolean,
  ): Simulator<Tail<Strategy>, [...AddedSteps, ProccessedStep<Strategy>]> {
    const schemaHead = head(this.schema)
    const schemaTail = tail(this.schema)
    const nextArray = [...this.nextArray, next]

    if (skip) {
      if (schemaHead.optional === false) {
        throw new Error(`Step is required: ${schemaHead.step}`)
      }

      return new Simulator<Tail<Strategy>, [...AddedSteps, ProccessedStep<Strategy>]>(
        schemaTail,
        this.originalSchema,
        this.state,
        this.nextArray as any,
      )
    }

    if (!schemaHead) {
      throw new Error('No more steps to process')
    }

    return new Simulator<Tail<Strategy>, [...AddedSteps, ProccessedStep<Strategy>]>(
      schemaTail,
      this.originalSchema,
      this.state,
      nextArray as any,
    )
  }
}
