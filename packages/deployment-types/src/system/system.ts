import { SystemActionNames } from './actions'
import { SystemAutomationNames } from './automation'
import { SystemCoreNames } from './core'

export type SystemNames = SystemCoreNames | SystemActionNames | SystemAutomationNames

export type SystemConfigEntry = {
  name: SystemNames
  addToRegistry: boolean
  constructorArgs?: Array<number | string>
}

export type SystemCoreConfig = Record<SystemCoreNames, SystemConfigEntry>
export type SystemActionConfig = Record<SystemActionNames, SystemConfigEntry>
export type SystemAutomationConfig = Record<SystemAutomationNames, SystemConfigEntry>

export type SystemConfig = {
  core: SystemCoreConfig
  actions: SystemActionConfig
  automation: SystemAutomationConfig
}
