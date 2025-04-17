import type { ISimulationState } from '../../interfaces/simulation'
import type { Tail } from '../../interfaces/helperTypes'
import { head, tail } from '../utils'
import { processStepOutput } from './stepProcessor/stepOutputProcessors'
import { stateReducer } from './reducer/stateReducers'
import type { SimulationStrategy } from '@summerfi/sdk-common'
import { steps, Maybe, ProtocolName, SimulationSteps } from '@summerfi/sdk-common'
import {
  GetReferencedValue,
  NextFunction,
  Paths,
  ProccessedStep,
  StepsAdded,
} from '../../interfaces/steps'

export class Simulator<Strategy extends SimulationStrategy, AddedSteps extends StepsAdded> {
  public schema: Strategy
  public originalSchema: SimulationStrategy
  private state: ISimulationState
  private readonly nextArray: Readonly<NextFunction<SimulationStrategy, AddedSteps>[]>

  private constructor(
    schema: Strategy,
    originalSchema: SimulationStrategy,
    state: ISimulationState = { swaps: [], balances: {}, positions: {}, steps: [] },
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
    const stepNames = this.originalSchema.map((step) => step.name)
    const index = stepNames.indexOf(stepName as string)
    const step: Maybe<steps.Steps> = this.state.steps[index]

    if (!step) {
      throw new Error(`Step not found: ${stepName}`)
    }

    const outputs = step.outputs

    if (!outputs) {
      throw new Error(`Step has no outputs: ${stepName}`)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (outputs as any)[output]
    // validation if path exists
    if (!value) {
      throw new Error(`Output not found: ${stepName}.outputs.${output as string}`)
    }

    return {
      estimatedValue: value,
      path,
    }
  }

  public async run(): Promise<ISimulationState & { getReference: GetReferencedValue<AddedSteps> }> {
    for (let i = 0; i < this.nextArray.length; i++) {
      const nextStep = await this.nextArray[i]({
        state: this.state,
        getReference: this.getReference as GetReferencedValue<AddedSteps>,
      })

      const fullStep = await processStepOutput(nextStep)
      this.state = stateReducer(fullStep, this.state)
    }

    return { ...this.state, getReference: this.getReference as GetReferencedValue<AddedSteps> }
  }

  public next(
    next: NextFunction<Strategy, AddedSteps>,
    skipData?: { skip: boolean; type: SimulationSteps; protocol?: ProtocolName },
  ): Simulator<Tail<Strategy>, [...AddedSteps, ProccessedStep<Strategy>]> {
    const schemaHead = head(this.schema)
    const schemaTail = tail(this.schema)

    if (skipData && skipData.skip) {
      if (schemaHead.optional === false) {
        throw new Error(`Step is required: ${schemaHead.step}`)
      }

      const skippedNext = [
        ...this.nextArray,
        async () => ({
          type: SimulationSteps.Skipped,
          inputs: skipData,
        }),
      ]

      return new Simulator<Tail<Strategy>, [...AddedSteps, ProccessedStep<Strategy>]>(
        schemaTail,
        this.originalSchema,
        this.state,
        // TODO: We should not use any here
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        skippedNext as any,
      )
    }

    if (!schemaHead) {
      throw new Error('No more steps to process')
    }

    const nextArray = [...this.nextArray, next]

    return new Simulator<Tail<Strategy>, [...AddedSteps, ProccessedStep<Strategy>]>(
      schemaTail,
      this.originalSchema,
      this.state,
      // TODO: We should not use any here
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      nextArray as any,
    )
  }
}
