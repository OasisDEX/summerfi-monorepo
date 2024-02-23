import { ActionNames } from '@summerfi/deployment-types'
import { ActionInputStorageNames, ActionOutputStorageNames } from '~orderplanner/context'

export type ActionVersion = number

export type ActionConfig = Readonly<{
  name: ActionNames
  version: ActionVersion
  parametersAbi: string
  storageInputs: ActionInputStorageNames
  storageOutputs: ActionOutputStorageNames
}>

/**
 * @name ActionCall
 * @description Represents a call to a smart contract method
 */
export type ActionCall = {
  targetHash: string
  callData: string
}

export type ActionCallBatch = ActionCall[]
