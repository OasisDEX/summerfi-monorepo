import { ActionNames } from '@summerfi/deployment-types'
import { ActionInputStorageNames, ActionOutputStorageNames } from '~orderplannercommon/context'

export type ActionVersion = number

export type ActionConfig = {
  readonly name: ActionNames
  readonly version: ActionVersion
  readonly parametersAbi: string
  readonly storageInputs: ActionInputStorageNames
  readonly storageOutputs: ActionOutputStorageNames
}

/**
 * @name ActionCall
 * @description Represents a call to a smart contract method
 */
export type ActionCall = {
  targetHash: string
  callData: string
}

export type ActionCallBatch = ActionCall[]
