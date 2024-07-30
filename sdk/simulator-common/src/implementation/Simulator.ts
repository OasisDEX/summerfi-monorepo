import { Maybe, ProtocolName } from '@summerfi/sdk-common'
import { assert } from 'console'
import type { ISimulationState } from '../interfaces/ISimulationState'
import type { Tail } from '../interfaces/helperTypes'
import { SimulatorConfig } from '../types'
import { GetReferencedValue } from '../types/GetReferencedValue'
import { NextFunction } from '../types/NextFunction'
import { Paths } from '../types/Paths'
import { ProcessedStep } from '../types/ProcessedStep'
import { SimulationStepsEnum } from '../types/SimulationStepsEnum'
import { SimulationStrategy } from '../types/SimulationStrategy'
import { StateReducer } from '../types/StateReducer'
import { StateReducers } from '../types/StateReducers'
import { Step } from '../types/Step'
import { StepOutputProcessor } from '../types/StepOutputProcessor'
import { StepOutputProcessors } from '../types/StepOutputProcessors'
import { StepsAdded } from '../types/StepsAdded'
import { StepsWithoutOutputs } from '../types/StepsWithoutOutputs'
import { head, tail } from '../utils'

/**
 * @class Simulator
 * @description The main class for the simulation engine. It is a generic simulator that given a schema
 *              and a set of supported Steps allows to run a simulation for a certain type of strategy
 */
export class Simulator<
  StepsEnum extends SimulationStepsEnum,
  Strategy extends SimulationStrategy<StepsEnum> = SimulationStrategy<StepsEnum>,
  Steps extends Step<StepsEnum[keyof StepsEnum], unknown, unknown> = Step<
    StepsEnum[keyof StepsEnum],
    unknown,
    unknown
  >,
  AddedSteps extends StepsAdded<StepsEnum, Steps> = StepsAdded<StepsEnum, Steps>,
  SimulationState extends ISimulationState<StepsEnum, Steps> = ISimulationState<StepsEnum, Steps>,
> {
  public schema: Strategy
  public originalSchema: SimulationStrategy<StepsEnum>
  public stepOutputProcessors: StepOutputProcessors<StepsEnum, Steps>
  public stateReducers: StateReducers<StepsEnum, Steps, SimulationState>
  private state: SimulationState
  private readonly nextArray: Readonly<
    NextFunction<StepsEnum, Strategy, Steps, AddedSteps, SimulationState>[]
  >

  private constructor(
    params: SimulatorConfig<StepsEnum, Strategy, Steps, AddedSteps, SimulationState>,
  ) {
    const { schema, originalSchema, outputProcessors, stateReducers, state, nextArray } = params

    this.schema = schema
    this.originalSchema = originalSchema || schema
    this.stepOutputProcessors = outputProcessors
    this.stateReducers = stateReducers
    this.state = state
    this.nextArray = nextArray || []
  }

  static create<
    StepsEnum extends SimulationStepsEnum,
    Strategy extends SimulationStrategy<StepsEnum>,
    Steps extends Step<StepsEnum[keyof StepsEnum], unknown, unknown>,
    AddedSteps extends StepsAdded<StepsEnum, Steps> = StepsAdded<StepsEnum, Steps>,
    SimulationState extends ISimulationState<StepsEnum, Steps> = ISimulationState<StepsEnum, Steps>,
  >(params: SimulatorConfig<StepsEnum, Strategy, Steps, AddedSteps, SimulationState>) {
    const { schema, outputProcessors, stateReducers, state } = params

    // The second argument is the same as from the first schema we will subtract steps
    // with each next step added we also need to keep the original schema for future reference
    return new Simulator<StepsEnum, Strategy, Steps, [], SimulationState>({
      schema,
      originalSchema: schema,
      outputProcessors,
      stateReducers,
      state,
    })
  }

  private getReference = (path: Paths<StepsEnum, Steps, AddedSteps>) => {
    const [stepName, output] = path
    const stepNames = this.originalSchema.map((step) => step.name)
    const index = stepNames.indexOf(stepName as string)
    const step: Maybe<Steps> = this.state.steps[index]

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

  public async run(): Promise<
    SimulationState & { getReference: GetReferencedValue<StepsEnum, Steps, AddedSteps> }
  > {
    for (let i = 0; i < this.nextArray.length; i++) {
      const nextStep = await this.nextArray[i]({
        state: this.state,
        getReference: this.getReference as GetReferencedValue<StepsEnum, Steps, AddedSteps>,
      })

      const fullStep = await this._processStepOutput(nextStep)
      this.state = this._processStateReducer(fullStep, this.state)
    }

    return {
      ...this.state,
      getReference: this.getReference as GetReferencedValue<StepsEnum, Steps, AddedSteps>,
    }
  }

  public next(
    next: NextFunction<StepsEnum, Strategy, Steps, AddedSteps, SimulationState>,
    skipData?: { skip: boolean; type: SimulationSteps; protocol?: ProtocolName },
  ): Simulator<
    StepsEnum,
    Tail<Strategy>,
    Steps,
    [...AddedSteps, ProcessedStep<StepsEnum, Steps, Strategy>],
    SimulationState
  > {
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

      return new Simulator<
        StepsEnum,
        Tail<Strategy>,
        Steps,
        [...AddedSteps, ProcessedStep<StepsEnum, Steps, Strategy>],
        SimulationState
      >({
        schema: schemaTail,
        originalSchema: this.originalSchema,
        outputProcessors: this.stepOutputProcessors,
        stateReducers: this.stateReducers,
        state: this.state,
        // TODO: We should not use any here
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        nextArray: skippedNext as any,
      })
    }

    if (!schemaHead) {
      throw new Error('No more steps to process')
    }

    const nextArray = [...this.nextArray, next]

    return new Simulator<
      StepsEnum,
      Tail<Strategy>,
      Steps,
      [...AddedSteps, ProcessedStep<StepsEnum, Steps, Strategy>],
      SimulationState
    >({
      schema: schemaTail,
      originalSchema: this.originalSchema,
      outputProcessors: this.stepOutputProcessors,
      stateReducers: this.stateReducers,
      state: this.state,
      // TODO: We should not use any here
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      nextArray: nextArray as any,
    })
  }

  private async _processStepOutput<SingleStep extends Steps>(
    step: StepsWithoutOutputs<StepsEnum, SingleStep>,
  ): Promise<Steps> {
    const processor = this.stepOutputProcessors[step.type] as unknown as StepOutputProcessor<
      StepsEnum,
      Steps,
      SingleStep
    >

    assert(
      processor,
      `No output processor found for step type: ${step.type}. This is a configuration error.`,
    )

    return await processor(step)
  }

  private _processStateReducer(step: Steps, state: SimulationState): SimulationState {
    const reducer = this.stateReducers[step.type] as StateReducer<
      StepsEnum,
      Steps,
      Steps,
      SimulationState
    >

    return reducer(step, state)
  }
}
