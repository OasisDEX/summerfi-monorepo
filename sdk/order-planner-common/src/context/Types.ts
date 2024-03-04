import { steps } from '@summerfi/sdk-common/simulation'
import { BaseAction } from '~orderplannercommon/actions/BaseAction'

export type Slot = number

export type StorageAliasMap<
  StepStorageKey extends string | number | symbol,
  ActionStorageKey extends string | number | symbol,
> = Record<StepStorageKey, ActionStorageKey>

export type StorageInputsType<Action extends BaseAction> = Action['config']['storageInputs'][number]
export type StorageOutputsType<Action extends BaseAction> =
  Action['config']['storageOutputs'][number]

export type StepKeysMatching<Step extends steps.Steps, V> = {
  [K in keyof Step['inputs']]-?: Step['inputs'][K] extends V ? K : never
}[keyof Step['inputs']]

// TODO: The StepInputsType should be using the StepKeysMatching type to extract only the names that are of
// type ValueReference, but for some reason the resolution of the type does not work when using an object
// imported from another package, like the SwapStep from the sdk-common package. For now all the keys in the
// object are used as the type for the StepInputsType.
export type StepInputsType<T extends steps.Steps> = keyof T['inputs']
export type StepOutputsType<T extends steps.Steps> = keyof T['outputs']

export type StorageInputsMapType<
  Step extends steps.Steps,
  Action extends BaseAction,
> = StorageAliasMap<StepInputsType<Step>, StorageInputsType<Action>>

export type StorageOutputsMapType<
  Step extends steps.Steps,
  Action extends BaseAction,
> = StorageAliasMap<StepOutputsType<Step>, StorageOutputsType<Action>>
