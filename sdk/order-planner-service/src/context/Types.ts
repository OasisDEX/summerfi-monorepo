import { Steps } from '@summerfi/sdk-common/orders'
import { BaseAction } from '~orderplanner/actions'

export type Slot = number
export type ActionStorageName = string

export type ActionInputStorageNames = ReadonlyArray<ActionStorageName>
export type ActionOutputStorageNames = ReadonlyArray<ActionStorageName>

export type StorageAliasMap<
  StepStorageKey extends string | number | symbol,
  ActionStorageKey extends string | number | symbol,
> = Record<StepStorageKey, ActionStorageKey>

export type StorageInputsType<Action extends BaseAction> = Action['config']['storageInputs'][number]
export type StorageOutputsType<Action extends BaseAction> =
  Action['config']['storageOutputs'][number]

export type StepOutputsType<T extends Steps> = keyof T['outputs']

export type StorageInputsMapType<Step extends Steps, Action extends BaseAction> = StorageAliasMap<
  StepOutputsType<Step>,
  StorageInputsType<Action>
>

export type StorageOutputsMapType<Step extends Steps, Action extends BaseAction> = StorageAliasMap<
  StepOutputsType<Step>,
  StorageOutputsType<Action>
>
