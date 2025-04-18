import { ActionNames } from '@summerfi/deployment-types'
import { HexData } from '@summerfi/sdk-common'

/**
 * Helper types
 */
export type ActionStorageName = string
export type ActionInputStorageNames = ReadonlyArray<ActionStorageName>
export type ActionOutputStorageNames = ReadonlyArray<ActionStorageName>
export type ActionVersion = number

/**
 * @name ActionConfig
 * @description Represents the configuration of an action contract
 */
export type ActionConfig = {
  /** The name of the action */
  readonly name: ActionNames | 'SkippedAction'
  /** The version of the action */
  readonly version: ActionVersion
  /** Human-readable ABI parameters (check `viem` documentation) */
  readonly parametersAbi: readonly [string, ...string[]]
  /** The list of storage inputs for the action, this is the values that will be read from the storage */
  readonly storageInputs: ActionInputStorageNames
  /** The list of storage outputs for the action, this is the values that will be saved to the storage */
  readonly storageOutputs: ActionOutputStorageNames
}

/**
 * @name ActionCall
 * @description Represents a call to a smart contract method
 */
export type ActionCall = {
  /** Name of the action for logging */
  readonly name: ActionNames | 'SkippedAction'
  /** The hash of the action name plus its version */
  readonly targetHash: HexData
  /** The call data to be sent to the smart contract */
  readonly callData: HexData
  /** If the action was skipped */
  readonly skipped: boolean
}

/**
 * @name ActionCallBatch
 * @description Represents a batch of action calls
 */
export type ActionCallBatch = ActionCall[]
