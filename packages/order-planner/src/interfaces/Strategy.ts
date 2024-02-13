import { Optionals, ActionsStepShortDefinition, VersionedAction } from './Action'
import { Version } from './Types'

export type StorageKeys = {
  actionIndex: number
  storedValueName: string
}

/** Single step of the strategy, it uses a versioned action and declares the storage
    keys to be used from the action and whether the action is optional */
export type StrategySingleStep = {
  action: VersionedAction
  storageKeys?: StorageKeys
  isOptional: boolean
}

/** Allows to define partial strategies, to be used in Refinance */
export type PartialStrategy = {
  steps: StrategyStep[]
}

/**
 * @name StrategyName
 * @description All the strategy names: it is the name used to generate the final
 *              strategies, taking into account the optionality of some actions
 */
export enum StrategyName {
  DepositBorrow = 'DepositBorrow',
  AdjustRiskUp = 'AdjustRiskUp',
}

export type StrategyStep = StrategySingleStep | PartialStrategy

/** Definition of a strategy based on steps or partial strategies */
export type StrategyDefinition = {
  name: StrategyName
  steps: StrategyStep[]
}

/**
 * @name VersionedStrategyDefinition
 * @description Represents a strategy with its version
 */
export type VersionedStrategyDefinition = {
  version: Version
  strategy: StrategyDefinition
}

/**
 * @name StrategyShortDefinitions
 * @description Represents the short definition of a strategy, the generation tool will expand
 *              this definition to a full strategy definition, including the version and taking
 *              into account the optionality of some actions
 *
 *              It also contains a suffix map, which is used when generating the full strategy. For each
 *              optional flag, it contains the suffix to be used in the full strategy name so they can be
 *              distinguished
 */
export type StrategyShortDefinitions = {
  [key in StrategyName]: {
    steps: ActionsStepShortDefinition[]
    suffixMap?: {
      [key in Optionals]?: string
    }
  }
}
