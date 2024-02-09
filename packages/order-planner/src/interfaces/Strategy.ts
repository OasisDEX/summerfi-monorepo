import { VersionedAction } from './Action'
import { Versioned } from './Types'

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

/** All the strategy base names: base indicates that it is the name
    used to generate the final strategies, taking into account the
    optionality of some actions */
export enum StrategyBaseName {
  DepositBorrow = 'DepositBorrow',
  AdjustRiskUp = 'AdjustRiskUp',
}

export type StrategyStep = StrategySingleStep | PartialStrategy

/** Definition of a strategy based on steps or partial strategies */
export type StrategyDefinition = {
  name: StrategyBaseName
  steps: StrategyStep[]
}

/**
 * @name VersionedStrategyDefinition
 * @description Represents a strategy with its version
 */
export type VersionedStrategyDefinition = Versioned<StrategyDefinition>
