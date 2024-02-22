import { ActionNames } from '@summerfi/deployment-types'
import { Version } from '~orderplanner/interfaces'
import { ActionInputStorageNames, ActionOutputStorageNames } from '~orderplanner/context/Types'

export type ActionConfig = Readonly<{
  name: ActionNames
  version: Version
  parametersAbi: string
  storageInputs: ActionInputStorageNames
  storageOutputs: ActionOutputStorageNames
}>
