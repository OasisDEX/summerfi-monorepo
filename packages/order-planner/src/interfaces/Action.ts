import { Simulation } from '@summerfi/sdk'
import { Versioned } from './Types'

/**
 * @name ActionVersion
 * @description Represents the version of an action
 */
export type ActionVersion = number

/**
 * @name ActionCall
 * @description Represents a call to a smart contract method
 */
export type ActionCall = {
  targetHash: string
  callData: string
}

/**
 * @name ActionType
 * @description Represents the type of an action. Each action has a unique type
 */
export enum ActionType {
  PullToken = 'PullToken',
  SendToken = 'SendToken',
  Flashloan = 'Flashloan',
}

/**
 * @name StoredParameterKey
 * @description Represents the key of a parameter stored in the executor storage
 */
export type ParameterKey = string

/**
 * @name StoredParameterSlot
 * @description Represents the slot of a parameter stored in the executor storage
 */
export type StoredParameterSlot = number

/**
 * @name StorageMapping
 * @description Represents the mapping of the parameters that an action may store
 *              in the executor storage
 */
export type StorageMapping = Record<ParameterKey, StoredParameterSlot>

/**
 * @name ActionParameters
 * @description Represents the parameters that an action may need to build its calldata
 */
export interface ActionParameters {
  // To be specialized by each action
}

/**
 * @name ActionCallBuilder
 * @description It is the function that builds the calldata for a specific action given
 *              a simulation.
 */
export type ActionCallBuilder = (
  parameters: ActionParameters,
  storageMapping: StorageMapping,
  currentStorageIndex: number,
) => ActionCall

/**
 * @name ActionDefinition
 * @description Represents the definition of an action. It contains the type of the action,
 *              the version of the action, the builder of the action, and the storage mapping
 */
export type ActionDefinition = {
  type: ActionType
  version: ActionVersion
  builder: ActionCallBuilder
  storageMapping: StorageMapping
}

/**
 * @name ActionParameterFetcher
 * @description Translates the data of a simulation into the parameters that an action needs
 */
export type ActionParameterFetcher = (simulation: Simulation) => ActionParameters

/**
 * @name VersionedAction
 * @description Represents an action with its version
 */
export type VersionedAction = Versioned<ActionType>
