import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { type IPositionsManager } from '@summerfi/sdk-common/orders'
import { IUser } from '@summerfi/sdk-common/user'
import { IStepBuilderContext } from './IStepBuilderContext'
import { type IProtocolPluginsRegistry } from './IProtocolPluginsRegistry'
import { IAddressBookManager } from '@summerfi/address-book-common'

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
 * Interface for an action builder
 *
 * The actions builders are responsible for building the actions for the simulation steps,
 * this is they translate the simulation steps into actual actions that can be executed
 * in a transaction
 */
export interface IActionBuilder<StepType extends steps.Steps> {
  /**
   * Main function to build the action
   *
   * @param params Specific parameters for the action builder. @see ActionBuilderParams
   */
  build(params: ActionBuilderParams<FilterStep<SimulationSteps, StepType>>): Promise<void>
}
