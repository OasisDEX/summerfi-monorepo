import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { Deployment } from '@summerfi/deployment-utils'
import { type IPositionsManager } from '@summerfi/sdk-common/orders'
import { IUser } from '@summerfi/sdk-common/user'
import { IStepBuilderContext } from '../interfaces/IStepBuilderContext'
import { IProtocolPluginsRegistry } from '../interfaces/IProtocolPluginsRegistry'

export type FilterStep<
  SimulationStep extends SimulationSteps,
  Step extends steps.Steps,
> = Step extends { type: SimulationStep } ? Step : never

export type ActionBuilderParams<Step extends steps.Steps> = {
  context: IStepBuilderContext
  user: IUser
  positionsManager: IPositionsManager
  swapManager: ISwapManager
  deployment: Deployment
  protocolsRegistry: IProtocolPluginsRegistry
  step: Step
}

export type ActionBuilderFunction<S extends steps.Steps> = (
  params: ActionBuilderParams<S>,
) => Promise<void>

export type ActionBuilder<StepType extends steps.Steps> = ActionBuilderFunction<
  FilterStep<SimulationSteps, StepType>
>

export type ActionBuildersMap = {
  [StepType in steps.Steps['type']]: ActionBuilderFunction<FilterStep<StepType, steps.Steps>>
}
