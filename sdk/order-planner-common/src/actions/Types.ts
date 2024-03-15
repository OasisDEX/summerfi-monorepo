import { ActionNames } from '@summerfi/deployment-types'
import { HexData } from '@summerfi/sdk-common/common'

export type ActionStorageName = string

export type ActionInputStorageNames = ReadonlyArray<ActionStorageName>
export type ActionOutputStorageNames = ReadonlyArray<ActionStorageName>

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
  targetHash: HexData
  callData: HexData
}

export type ActionCallBatch = ActionCall[]
