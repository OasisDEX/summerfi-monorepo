import { DependencyConfigType } from './dependencies'
import { ProtocolsConfigType } from './protocols'
import { SystemConfigType } from './system'

export type SystemConfig = {
  system: SystemConfigType
  dependencies: DependencyConfigType
  protocols: ProtocolsConfigType
}
