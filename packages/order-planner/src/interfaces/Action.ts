import { Simulation } from '@summerfi/sdk'
import { Version } from './Types'

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
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
  Borrow = 'Borrow',
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
  version: Version
  builder: ActionCallBuilder
  storageMapping: StorageMapping
}

/**
 * @name ActionParameterFetcher
 * @description Translates the data of a simulation into the parameters that an action needs
 */
export type ActionParameterFetcher = (simulation: Simulation) => ActionParameters

/**
 * @name ActionStorageKey
 * @description Represents the key of a stored value in the executor storage
 */
export type ActionStorageKey = {
  actionIndex: number
  storedValueName: string
}

/**
 * @name VersionedAction
 * @description Represents an action with its version
 */
export type VersionedAction = {
  version: Version
  action: ActionType
}

/**
 * @name Optionals
 * @description Represents the flag that indicates whether an action is optional or not. The number in
 *              the flag can be used to link actions together, so they are optional together
 */
export enum Optionals {
  Optional0 = 'Optional0',
  Optional1 = 'Optional1',
  Optional2 = 'Optional2',
  Optional3 = 'Optional3',
  Optional4 = 'Optional4',
  Optional5 = 'Optional5',
  Optional6 = 'Optional6',
  Optional7 = 'Optional7',
  Optional8 = 'Optional8',
  Optional9 = 'Optional9',
  Optional10 = 'Optional10',
  Mandatory = 'Mandatory',
}

/**
 * @name ActionsStepShortDefinition
 * @description Represents the short definition of a step in a strategy
 *
 * @property {ActionType} actionType - The type of the action
 * @property {ActionParameterFetcher[]} parameterFetchers - The parameter fetchers of the action
 * @property {ActionStorageKey[]} storageKeys - The keys that will be passed to the action to retrieve values from
 * @property {Optionals} optional - The flag that indicates whether the action is optional or not
 * @property {Optionals[]} exclusion - Indicates which other optionals are mutually exclusive with this one
 */
export type ActionsStepShortDefinition = [
  actionType: ActionType,
  parameterFetchers: ActionParameterFetcher[],
  storageKeys: ActionStorageKey[],
  optional: Optionals,
  exclusion?: Optionals[],
]
