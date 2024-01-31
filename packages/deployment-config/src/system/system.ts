import { SystemActionNames } from './actions'
import { SystemAutomationNames } from './automation'
import { SystemCoreNames } from './core'

export type SystemNames = SystemCoreNames | SystemActionNames | SystemAutomationNames

export type SystemConfigEntry = {
  name: SystemNames
  serviceRegistryName: string
  constructorArgs?: Array<number | string>
}

export type SystemCoreConfigType = Record<SystemCoreNames, SystemConfigEntry>
export type SystemActionConfigType = Record<SystemActionNames, SystemConfigEntry>
export type SystemAutomationConfigType = Record<SystemAutomationNames, SystemConfigEntry>

export type SystemConfigType = {
  core: SystemCoreConfigType
  actions: SystemActionConfigType
  automation: SystemAutomationConfigType
}
