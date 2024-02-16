import { Order, Simulation, SimulationSteps, SimulationType, Step } from '@summerfi/sdk/orders'
import { Maybe } from '@summerfi/sdk/utils'
import { IOrderPlanner } from '~orderplanner/interfaces/IOrderPlanner'
import { ActionCall, StepBuildersMap } from '~orderplanner/interfaces'
import { StepBuilder } from '~orderplanner/interfaces/Types'

export class OrderPlanner implements IOrderPlanner {
  private readonly _stepBuildersMap: StepBuildersMap

  constructor(deployment: Deployment, stepBuildersMap: StepBuildersMap) {
    this._stepBuildersMap = stepBuildersMap
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  buildOrder(simulation: Simulation<SimulationType, unknown>): Maybe<Order> {
    const simulationCalls = simulation.steps.reduce(
      (actions: ActionCall[], step: Step<SimulationSteps>) => {
        const stepBuilder = this._stepBuildersMap[step.type] as StepBuilder<typeof step.type>
        if (!stepBuilder) {
          throw new Error(`No step builder found for step type ${step.type}`)
        }

        const actionCalls = stepBuilder({ step })

        return [...actions, ...actionCalls]
      },
      [] as ActionCall[],
    )

    return undefined
  }
}
