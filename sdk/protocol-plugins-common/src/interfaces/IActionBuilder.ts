import { SimulationSteps, steps, IUser } from '@summerfi/sdk-common'
import { ISwapManager } from '@summerfi/swap-common'
import { type IPositionsManager } from '@summerfi/sdk-common'
import { IStepBuilderContext } from './IStepBuilderContext'
import { type IProtocolPluginsRegistry } from './IProtocolPluginsRegistry'
import { IAddressBookManager } from '@summerfi/address-book-common'
import { IActionConstructor } from './IAction'

/**
 * Parameters for an action builder
 */
export type ActionBuilderParams<Step extends steps.Steps> = {
  context: IStepBuilderContext
  user: IUser
  positionsManager: IPositionsManager
  swapManager: ISwapManager
  addressBookManager: IAddressBookManager
  protocolsRegistry: IProtocolPluginsRegistry
  step: Step
  actionBuildersMap: ActionBuildersMap
}

/**
 * Constructor for an action builder
 */
export type IActionBuilderConstructor<StepType extends steps.Steps> =
  new () => IActionBuilder<StepType>

/**
 * Helper type to filter the steps by the simulation step type
 */
export type FilterStep<
  SimulationStep extends SimulationSteps,
  Step extends steps.Steps,
> = Step extends { type: SimulationStep } ? Step : never

/**
 * Map of action builders to be used to register the action builders in the protocol plugins
 */
export type ActionBuildersMap = {
  [StepType in steps.Steps['type']]: IActionBuilderConstructor<FilterStep<StepType, steps.Steps>>
}

/**
 * Special type to indicate that the build process is delegated to the protocol
 */
export type DelegatedToProtocol = 'DelegatedToProtocol'

/**
 * Declaration of an action that the Action Builder uses internally
 *
 * This is used by the Strategy Definition generation tool to identify the actions that are used by the Action Builder
 *
 * The `isOptionalTag` is used to identify whether the action is optional (if the tag is pressent) or not. The tag itself
 * will be used by the generation tool to narrow down the amount of possibilites in the Strategy Definition branching
 *
 * This is done through a definition given to the generation tool that will allow it to identify which strategy level
 * optionals are related to the actions optionals
 *
 * If the action is DelegatedToProtocol, the action will be delegated to the protocol plugin. This indicates to the
 * generation tool that it needs to branch for each single protocol plugin
 */
export type ActionBuilderUsedAction = {
  /** Action used in the builder */
  action: IActionConstructor | DelegatedToProtocol
  /** Tag to identify the action as optional */
  isOptionalTags?: string[]
}

/**
 * Interface for an action builder
 *
 * The actions builders are responsible for building the actions for the simulation steps,
 * this is they translate the simulation steps into actual actions that can be executed
 * in a transaction
 */
export interface IActionBuilder<StepType extends steps.Steps> {
  /**
   * List of actions that are used by the action builder and whether they are optional or not
   * The order of the declared action must coincide with the order of the actions in the `build` function
   */
  readonly actions: ActionBuilderUsedAction[]

  /**
   * Main function to build the action
   *
   * @param params Specific parameters for the action builder. @see ActionBuilderParams
   */
  build(params: ActionBuilderParams<FilterStep<SimulationSteps, StepType>>): Promise<void>
}
