import { steps } from '@summerfi/sdk-common'
import { ReferenceableField } from '@summerfi/sdk-common'
import { ActionConfig } from '../actions/Types'

//export type Slot = number

/**
 * A record of step inputs/outputs name to actions input/output storage keys
 *
 * Used to define the type of connectedInputs/connectedOutputs when adding an action call from a step
 */
export type StorageAliasMap<
  StepStorageKey extends string | number | symbol,
  ActionStorageKey extends string | number | symbol,
> = Record<StepStorageKey, ActionStorageKey>

/**
 * Type for the storage inputs defined in the action config
 */
export type StorageInputsType<Config extends ActionConfig> = Config['storageInputs'][number]

/**
 * Type for the storage outputs defined in the action config
 */
export type StorageOutputsType<Config extends ActionConfig> = Config['storageOutputs'][number]

/**
 * Extracts all the step inputs that extend a certain type. Used to extract all ReferenceableFields names
 * from a step inputs
 */
export type StepKeysMatching<Step extends steps.Steps, V> = {
  [K in keyof Step['inputs']]-?: Step['inputs'][K] extends V ? K : never
}[keyof Step['inputs']]

/**
 * Definition for a step inputs type. It extracts all the ReferenceableFields names from a step inputs
 * and creates a union type with them. This helps type check the connectedInputs when adding an action call
 */
export type StepInputsType<Step extends steps.Steps> = StepKeysMatching<
  Step,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ReferenceableField<any>
>

/**
 * Definition for a step outputs type. It extracts all outputs names from a step and creates a union type with them.
 * This helps type check the connectedOutputs when adding an action call
 */
export type StepOutputsType<Step extends steps.Steps> = keyof Step['outputs']

/**
 * Record type for the connectedInputs when adding an action call from a step
 *
 * As keys it has all the step inputs that are ReferenceableFields and as values the union type for all
 * of the action storageInputs
 */
export type StorageInputsMapType<
  Step extends steps.Steps,
  Config extends ActionConfig,
> = StorageAliasMap<StepInputsType<Step>, StorageInputsType<Config>>

/**
 * Record type for the connectedOutputs when adding an action call from a step
 *
 * As keys it has all the step outputs names and as values the union type for all of the
 * action storageOutputs
 */
export type StorageOutputsMapType<
  Step extends steps.Steps,
  Config extends ActionConfig,
> = StorageAliasMap<StepOutputsType<Step>, StorageOutputsType<Config>>
