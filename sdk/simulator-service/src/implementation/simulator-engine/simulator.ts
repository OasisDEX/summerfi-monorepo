import type { ISimulationState } from '../../interfaces/simulation'
import type { Head, Tail, Where } from '../../interfaces/helperTypes'
import type { NextFunction, Reference } from '../../interfaces'
import { head, makeStrategy, tail } from '../utils'
import { processStepOutput } from './stepProcessor/stepOutputProcessors'
import { stateReducer } from './reducer/stateReducers'
import type { SimulationStrategy } from '@summerfi/sdk-common/simulation'
import { FlashloanProvider, SimulationSteps, TokenTransferTargetType, steps } from '@summerfi/sdk-common/simulation'
import { StrategyStep, ValueReference } from '@summerfi/sdk-common'
import { Steps } from 'node_modules/@summerfi/sdk-common/src/simulation/Steps'
import { Position, Token, TokenAmount } from '@summerfi/sdk-common/common/implementation'

type NextStep<S extends Readonly<StrategyStep[]>> = Promise<Omit<Where<Steps, { type: Head<S>['step'] }>, 'outputs'>>
type ProccessedStep<S extends Readonly<StrategyStep[]>> = { name: Head<S>['name'], step: Where<Steps, { type: Head<S>['step'] }> }
type Paths<S extends { name: string, step: Steps }[]> = { [K in keyof S]: keyof S[K]['step']['outputs'] extends never ? never : [S[K]['name'], keyof S[K]['step']['outputs']] }[number]
type GetReferencedValue<P extends Paths<S>, S extends { name: string, step: Steps }[]> = 
  (path: P) => ValueReference<Pick<Where<S[number], { name: P[0] }>['step']['outputs'], P[1]>[keyof Pick<Where<S[number], { name: P[0] }>['step']['outputs'], P[1]>]>


export class Simulator<
  Strategy extends SimulationStrategy,
  S extends { name: string, step: Steps }[]
> {
  public schema: Strategy
  public originalSchema: SimulationStrategy
  private state: ISimulationState
  private readonly nextArray: NextArray

  private constructor(
    schema: Strategy,
    originalSchema: SimulationStrategy,
    state: ISimulationState = { swaps: {}, balances: {}, positions: {}, steps: {} },
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
    return new Simulator<S, []>(schema, schema)
  }

  public async run(): Promise<ISimulationState> {
    for (let i = 0; i < this.nextArray.length; i++) {
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

      const fullStep = await processStepOutput(nextStep)
      this.state = stateReducer(fullStep, this.state)
    }

    return this.state
  }

  public next(
    next: (ctx: { getReference: GetReferencedValue<Paths<S>, S>, s: S }) => NextStep<Strategy>,
    skip?: boolean,
  ): Simulator<Tail<Strategy>, [...S, ProccessedStep<Strategy>]> {
    const schemaHead = head(this.schema)
    const schemaTail = tail(this.schema)
    const nextArray = [...this.nextArray, next] as const

    if (skip) {
      if (schemaHead.optional === false) {
        throw new Error(`Step is required: ${schemaHead.step}`)
      }

      return new Simulator<Tail<Strategy>, [...NextArray], Ref & Record<Name, Record<string, string>>>(
        schemaTail,
        this.originalSchema,
        this.state,
        this.nextArray,
      )
    }

    if (!schemaHead) {
      throw new Error('No more steps to process')
    }

    return new Simulator<Tail<Strategy>, [...NextArray, NextFunction<Strategy, Name>]>(
      schemaTail,
      this.originalSchema,
      this.state,
      nextArray,
    )
  }
}

const strategy = makeStrategy([
  {
    name: 'FL',
    step: SimulationSteps.Flashloan,
    optional: false,
  },
  {
  name: 'TestDeposit',
  step: SimulationSteps.DepositBorrow,
  optional: false,
},
{
  name: 'PbWd',
  step: SimulationSteps.PaybackWithdraw,
  optional: false,
},
{
  name: 'TestWithdraw',
  step: SimulationSteps.PaybackWithdraw,
  optional: false,
}
] as const)


const sim = Simulator.create(strategy)
  .next(async () => ({
    type: SimulationSteps.Flashloan,
    inputs: {
      amount: TokenAmount.createFrom({ amount: '100', token }),
      provider: FlashloanProvider.Maker,
    }
  })
)

declare const token: Token
declare const position: Position

const sim2 = sim.next(async () => ({
  type: SimulationSteps.DepositBorrow,
  inputs: {
    depositAmount: TokenAmount.createFrom({ amount: '100', token }),
    borrowAmount: TokenAmount.createFrom({ amount: '100', token }),
    borrowTargetType: TokenTransferTargetType.PositionsManager,
    position,
  }
}))


const sim3 = sim2.next(async (ctx) => {

  const x = ctx.getReference(['TestDeposit', 'borrowAmount'])

  return {
    type: SimulationSteps.PaybackWithdraw,
    inputs: {
      paybackAmount: TokenAmount.createFrom({ amount: '100', token }),
      withdrawAmount: TokenAmount.createFrom({ amount: '100', token }),
      withdrawTargetType: TokenTransferTargetType.PositionsManager,
      position,
    }
  }
})

sim3.next(async (ctx) => {
  // const y = ctx.getReference(['TestDeposit', 'depositAmount'])
  const x = ctx.getReference(['PbWd','withdrawAmount' ])
  
  return ({
  type: SimulationSteps.PaybackWithdraw,
  inputs: {
    paybackAmount: TokenAmount.createFrom({ amount: '100', token }),
    withdrawAmount: TokenAmount.createFrom({ amount: '100', token }),
    withdrawTargetType: TokenTransferTargetType.PositionsManager,
    position,
  }
})})



