import { DependenciesConfig, ProtocolsConfig } from '~deployment-types'
import { SystemConfig } from './system/system'

export type Config = {
  system: SystemConfig
  dependencies: DependenciesConfig
  protocols: ProtocolsConfig
}
