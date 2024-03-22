import { DependenciesConfig } from '../dependencies/dependency'
import { ProtocolsConfig } from '../protocols/protocols'
import { SystemConfig } from '../system/system'

export type Config = {
  system: SystemConfig
  dependencies: DependenciesConfig
  protocols: ProtocolsConfig
}
